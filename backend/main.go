package main

import (
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan ProgressUpdate)
var mutex = &sync.Mutex{}

// ProgressUpdate struct for sending progress updates
type ProgressUpdate struct {
	Progress int `json:"progress"`
}

// Function to handle file uploads
func uploadHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("处理上传请求")
	err := r.ParseMultipartForm(100 << 20) // 调整或移除上传文件大小限制
	if err != nil {
		fmt.Println("解析表单时出错:", err)
		http.Error(w, "解析表单时出错", http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		fmt.Println("获取文件时出错:", err)
		http.Error(w, "获取文件时出错", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	ip := r.FormValue("ip")
	ipVersion := r.FormValue("ipVersion")
	fmt.Printf("IP: %s, IP Version: %s\n", ip, ipVersion)

	uploadDir := "/tmp" // 上传目录
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		fmt.Println("上传目录不存在，尝试创建:", uploadDir)
		err = os.MkdirAll(uploadDir, os.ModePerm)
		if err != nil {
			fmt.Println("创建上传目录时出错:", err)
			http.Error(w, "创建上传目录时出错", http.StatusInternalServerError)
			return
		}
	}

	filePath := filepath.Join(uploadDir, handler.Filename)
	fmt.Println("文件路径:", filePath)
	outFile, err := os.Create(filePath)
	if err != nil {
		fmt.Println("创建文件时出错:", err)
		http.Error(w, "创建文件时出错", http.StatusInternalServerError)
		return
	}
	defer outFile.Close()

	fmt.Println("开始复制文件")
	_, err = io.Copy(outFile, file)
	if err != nil {
		fmt.Println("复制文件时出错:", err)
		http.Error(w, "复制文件时出错", http.StatusInternalServerError)
		return
	}
	fmt.Println("文件复制完成")

	// 调用 Go 内置的传输功能
	go transferFile(filePath, ip, handler.Filename)
	fmt.Fprintln(w, "文件上传成功并开始传输")
}

// Function to transfer file using Go and send progress updates via WebSocket
func transferFile(filePath, ip, fileName string) {
	conn, err := net.Dial("tcp", fmt.Sprintf("%s:1234", ip))
	if err != nil {
		fmt.Printf("连接到 %s 时出错: %s\n", ip, err)
		return
	}
	defer conn.Close()

	// 发送文件名
	fileNameBytes := []byte(fileName)
	fileNameSize := len(fileNameBytes)
	conn.Write([]byte{byte(fileNameSize >> 24), byte(fileNameSize >> 16), byte(fileNameSize >> 8), byte(fileNameSize)})

	_, err = conn.Write(fileNameBytes)
	if err != nil {
		fmt.Println("发送文件名时出错:", err)
		return
	}

	file, err := os.Open(filePath)
	if err != nil {
		fmt.Println("打开文件时出错:", err)
		return
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		fmt.Println("获取文件信息时出错:", err)
		return
	}
	fileSize := fileInfo.Size()

	fmt.Println("开始传输文件")
	buf := make([]byte, 1024)
	totalSent := int64(0)
	for {
		n, err := file.Read(buf)
		if err == io.EOF {
			break
		}
		if err != nil {
			fmt.Println("读取文件时出错:", err)
			return
		}

		_, err = conn.Write(buf[:n])
		if err != nil {
			fmt.Println("传输文件时出错:", err)
			return
		}

		totalSent += int64(n)
		progress := int((totalSent * 100) / fileSize)
		broadcast <- ProgressUpdate{Progress: progress}
	}

	fmt.Println("文件传输完成")
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatalf("升级到 WebSocket 时出错: %v\n", err)
	}
	defer ws.Close()

	mutex.Lock()
	clients[ws] = true
	mutex.Unlock()

	for {
		var msg ProgressUpdate
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("读取 JSON 时出错: %v\n", err)
			mutex.Lock()
			delete(clients, ws)
			mutex.Unlock()
			break
		}
	}
}

func handleMessages() {
	for {
		msg := <-broadcast
		mutex.Lock()
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("发送消息时出错: %v\n", err)
				client.Close()
				delete(clients, client)
			}
		}
		mutex.Unlock()
	}
}

func main() {
	http.HandleFunc("/upload", uploadHandler)
	http.HandleFunc("/ws", handleConnections)

	go handleMessages()

	fmt.Println("服务器监听在端口 10001")
	log.Fatal(http.ListenAndServe(":10001", nil))
}

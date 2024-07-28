package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func uploadFile(w http.ResponseWriter, r *http.Request) {
	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Unable to read file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// homeDir, err := os.UserHomeDir()

	homeDir := "/home/suhui/tmp/serverre"

	if err != nil {
		http.Error(w, "Unable to get user home directory", http.StatusInternalServerError)
		return
	}

	err = os.MkdirAll(homeDir+"/uploads", os.ModePerm)
	if err != nil {
		http.Error(w, "Unable to create uploads directory", http.StatusInternalServerError)
		return
	}

	dst, err := os.OpenFile(homeDir+"/uploads/"+r.Header.Get("Filename"), os.O_RDWR|os.O_CREATE, 0666)
	if err != nil {
		http.Error(w, "Unable to create file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "Unable to save file", http.StatusInternalServerError)
		return
	}

	fmt.Fprintln(w, "Upload successful")
}

func parametersHandler(w http.ResponseWriter, r *http.Request) {
	params := map[string]string{
		"param1": "value1",
		"param2": "value2",
	}
	json.NewEncoder(w).Encode(params)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/upload", uploadFile).Methods("POST")
	r.HandleFunc("/parameters", parametersHandler).Methods("GET")
	fmt.Println("Starting server on :8880")
	if err := http.ListenAndServe(":8880", r); err != nil {
		fmt.Println("Server failed:", err)
	}
}

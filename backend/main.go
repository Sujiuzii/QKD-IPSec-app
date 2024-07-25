package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type Parameters struct {
	Param1 string `json:"param1"`
	Param2 int    `json:"param2"`
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving the file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	dst, err := os.Create("./uploads/" + handler.Filename)
	if err != nil {
		http.Error(w, "Error creating the file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	_, err = io.Copy(dst, file)
	if err != nil {
		http.Error(w, "Error saving the file", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "File uploaded successfully")
}

func parametersHandler(w http.ResponseWriter, r *http.Request) {
	params := Parameters{
		Param1: "example",
		Param2: 123,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(params)
}

func main() {
	http.HandleFunc("/upload", uploadHandler)
	http.HandleFunc("/parameters", parametersHandler)

	fmt.Println("Server started at :8080")
	http.ListenAndServe(":8080", nil)
}


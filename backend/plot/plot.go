package main

import (
	"encoding/json"
	"fmt"
	"image/color"
	"io"
	"log"
	"os"
	"time"

	"gonum.org/v1/plot"
	"gonum.org/v1/plot/plotter"
	"gonum.org/v1/plot/vg"
)

// Interval represents the structure of each interval in the iperf3 JSON output
type Interval struct {
	Sum struct {
		Start         float64 `json:"start"`
		End           float64 `json:"end"`
		BitsPerSecond float64 `json:"bits_per_second"`
	} `json:"sum"`
}

// Iperf3Result represents the overall structure of the iperf3 JSON output
type Iperf3Result struct {
	Intervals []Interval `json:"intervals"`
}

func main() {
	// Read iperf3 JSON result file
	file, err := os.Open("iperf3_results.json")
	if err != nil {
		log.Fatalf("failed to open file: %v", err)
	}
	defer file.Close()

	byteValue, _ := io.ReadAll(file)

	var result Iperf3Result
	json.Unmarshal(byteValue, &result)

	// Prepare data for plotting
	bars := make(plotter.Values, len(result.Intervals))
	labels := make([]string, len(result.Intervals))
	startTime := time.Now()
	for i, interval := range result.Intervals {
		bars[i] = interval.Sum.BitsPerSecond / 1e6 // Convert to Mbps
		t := startTime.Add(time.Duration(interval.Sum.Start) * time.Second)
		labels[i] = t.Format("15:04:05")
	}

	// Create a new plot
	p := plot.New()

	p.Title.Text = "iperf3 Test Results"
	p.Y.Label.Text = "Bits per Second (Mbps)"

	// Create a bar chart
	barChart, err := plotter.NewBarChart(bars, vg.Points(30)) // Adjusted width
	if err != nil {
		log.Fatalf("failed to create bar chart: %v", err)
	}

	// Set bar color
	barChart.Color = color.RGBA{R: 28, G: 42, B: 97, A: 255} // Red color

	p.Add(barChart)

	// Customize the x-axis to display time labels
	p.NominalX(labels...)

	// Save the plot to a PNG file
	if err := p.Save(7.5*vg.Inch, 5*vg.Inch, "iperf3_custom_bar_plot.png"); err != nil {
		log.Fatalf("failed to save plot: %v", err)
	}

	fmt.Println("Custom bar plot saved as iperf3_custom_bar_plot.png")
}

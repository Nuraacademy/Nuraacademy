"use client"

import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface AmBarChartProps {
    data: any[];
    categoryField: string;
    valueFields: { field: string; label: string; color: string }[];
    height?: string;
    layout?: "vertical" | "horizontal";
}

export default function AmBarChart({ data, categoryField, valueFields, height = "300px", layout = "vertical" }: AmBarChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!chartRef.current) return;

        const root = am5.Root.new(chartRef.current);

        // Remove amCharts logo
        if (root._logo) {
            root._logo.dispose();
        }

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        const chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "none",
                wheelY: "none",
                layout: root.horizontalLayout
            })
        );

        // Add cursor
        const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);

        // Create axes
        const xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 30,
            minorGridEnabled: true
        });

        xRenderer.labels.template.setAll({
            centerY: am5.p50,
            centerX: am5.p50,
            paddingTop: 10,
            fontSize: 10,
            fill: am5.color("#9ca3af")
        });

        const xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: categoryField,
                renderer: xRenderer,
                tooltip: am5.Tooltip.new(root, {})
            })
        );

        xAxis.data.setAll(data);

        const yRenderer = am5xy.AxisRendererY.new(root, {});
        yRenderer.labels.template.setAll({
            fontSize: 10,
            fill: am5.color("#9ca3af")
        });

        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                min: 0,
                max: 100,
                renderer: yRenderer
            })
        );

        // Add axis title
        yAxis.children.unshift(
            am5.Label.new(root, {
                text: "Score",
                rotation: -90,
                centerY: am5.p50,
                centerX: am5.p50,
                fontSize: 10,
                fill: am5.color("#9ca3af"),
                fontWeight: "500"
            })
        );

        // Add series
        valueFields.forEach((item) => {
            const series = chart.series.push(
                am5xy.ColumnSeries.new(root, {
                    name: item.label,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: item.field,
                    categoryXField: categoryField,
                    tooltip: am5.Tooltip.new(root, {
                        labelText: "{name}: {valueY}%"
                    })
                })
            );

            series.columns.template.setAll({
                tooltipText: "{name}: {valueY}%",
                width: am5.percent(90),
                tooltipY: 0,
                strokeOpacity: 0,
                cornerRadiusTL: 2,
                cornerRadiusTR: 2,
                fill: am5.color(item.color)
            });

            series.data.setAll(data);
            series.appear();
        });

        // Add legend
        const legend = chart.children.push(am5.Legend.new(root, {
            centerY: am5.p50,
            y: am5.p50,
            layout: root.verticalLayout,
            marginLeft: 20
        }));

        legend.markers.template.setAll({
            width: 12,
            height: 12
        });

        legend.markerRectangles.template.setAll({
            cornerRadiusTL: 10,
            cornerRadiusTR: 10,
            cornerRadiusBL: 10,
            cornerRadiusBR: 10
        });

        legend.labels.template.setAll({
            fontSize: 10,
            fill: am5.color("#000000"),
            fontWeight: "400"
        });

        legend.data.setAll(chart.series.values);

        chart.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, [data, categoryField, valueFields]);

    return (
        <div ref={chartRef} style={{ width: "100%", height: height }}></div>
    );
}

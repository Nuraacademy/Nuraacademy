"use client"

import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface AmLineChartProps {
    data: any[];
    categoryField: string;
    valueField: string;
    strokeColor?: string;
    fillColor?: string;
    height?: string;
}

export default function AmLineChart({ data, categoryField, valueField, strokeColor = "#DAEE49", fillColor = "#1C3A37", height = "300px" }: AmLineChartProps) {
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
                layout: root.verticalLayout
            })
        );

        // Add cursor
        const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);

        // Create axes
        const xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 30
        });

        xRenderer.labels.template.setAll({
            fontSize: 10,
            fill: am5.color("#9ca3af")
        });

        const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: categoryField,
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {})
        }));

        xAxis.data.setAll(data);

        const yRenderer = am5xy.AxisRendererY.new(root, {});
        yRenderer.labels.template.setAll({
            fontSize: 10,
            fill: am5.color("#9ca3af")
        });

        const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            min: 0,
            max: 100,
            renderer: yRenderer
        }));

        // Add axis title
        yAxis.children.unshift(
            am5.Label.new(root, {
                text: "Learning Gain",
                rotation: -90,
                centerY: am5.p50,
                centerX: am5.p50,
                fontSize: 10,
                fill: am5.color("#9ca3af"),
                fontWeight: "500"
            })
        );

        // Add series
        const series = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Learning Gain",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: valueField,
            categoryXField: categoryField,
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY}"
            })
        }));

        series.strokes.template.setAll({
            strokeWidth: 2,
            stroke: am5.color(strokeColor)
        });

        // Add bullets
        series.bullets.push(function() {
            return am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    radius: 4,
                    fill: am5.color(fillColor),
                    stroke: am5.color(strokeColor),
                    strokeWidth: 2
                })
            });
        });

        series.data.setAll(data);
        series.appear(1000);
        chart.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, [data, categoryField, valueField, strokeColor, fillColor]);

    return (
        <div ref={chartRef} style={{ width: "100%", height: height }}></div>
    );
}

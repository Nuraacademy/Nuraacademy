"use client"

import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface AmPieChartProps {
    data: { category: string; value: number; color?: string }[];
    innerRadius?: number;
    radius?: number;
    height?: string;
    showLegend?: boolean;
    centerLabel?: string;
    centerSubLabel?: string;
}

export default function AmPieChart({ 
    data, 
    innerRadius = 70, 
    radius = 80,
    height = "200px", 
    showLegend = false,
    centerLabel,
    centerSubLabel
}: AmPieChartProps) {
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
            am5percent.PieChart.new(root, {
                innerRadius: am5.percent(innerRadius),
                radius: am5.percent(radius),
                layout: root.horizontalLayout
            })
        );

        const series = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "category",
                alignLabels: false
            })
        );

        series.labels.template.set("forceHidden", true);
        series.ticks.template.set("forceHidden", true);

        // Set colors if provided in data
        series.slices.template.setAll({
            templateField: "sliceSettings",
            strokeOpacity: 0
        });

        const chartData = data.map(item => ({
            ...item,
            sliceSettings: item.color ? { fill: am5.color(item.color) } : {}
        }));

        series.data.setAll(chartData);

        // Add Center Labels
        if (centerLabel) {
            chart.seriesContainer.children.push(am5.Label.new(root, {
                text: centerLabel,
                fontSize: 48,
                fontWeight: "500",
                fill: am5.color("#1C3A37"),
                centerX: am5.p50,
                centerY: am5.p50,
                textAlign: "center",
                dy: -10
            }));
        }

        if (centerSubLabel) {
            chart.seriesContainer.children.push(am5.Label.new(root, {
                text: centerSubLabel,
                fontSize: 12,
                fontWeight: "500",
                fill: am5.color("#9ca3af"),
                centerX: am5.p50,
                centerY: am5.p50,
                textAlign: "center",
                dy: 20
            }));
        }

        if (showLegend) {
            const legend = chart.children.push(am5.Legend.new(root, {
                centerY: am5.p50,
                y: am5.p50,
                layout: root.verticalLayout,
                marginLeft: 40
            }));

            legend.markers.template.setAll({
                width: 15,
                height: 15
            });

            legend.markerRectangles.template.setAll({
                cornerRadiusTL: 10,
                cornerRadiusTR: 10,
                cornerRadiusBL: 10,
                cornerRadiusBR: 10
            });

            legend.itemContainers.template.setAll({
                paddingBottom: 10
            });

            legend.labels.template.setAll({
                fontSize: 14,
                fill: am5.color("#000000"),
                fontWeight: "400",
                width: 150
            });

            legend.valueLabels.template.setAll({
                fontSize: 20,
                fill: am5.color("#000000"),
                fontWeight: "400",
                textAlign: "right"
            });

            legend.valueLabels.template.set("text", "{valuePercentTotal.formatNumber('0.00')}%");

            legend.data.setAll(series.dataItems);
        }

        series.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, [data, innerRadius, radius, showLegend, centerLabel, centerSubLabel]);

    return (
        <div ref={chartRef} style={{ width: "100%", height: height }}></div>
    );
}

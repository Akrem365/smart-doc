import React, { useEffect, useRef } from "react";
import { useAppcontext } from "../../context/appContext";
import ReactApexChart from "react-apexcharts";
import "../../assets/wrappers/stats.css";

function StatistiqueAll() {
  const { ageCounts, getAllPatientStats, atcdCounts, genderCounts } =
    useAppcontext();

  const chartRef = useRef(null);

  useEffect(() => {
    getAllPatientStats();
  }, []);

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: Object.keys(ageCounts), // Utilisation des clés de ageCounts comme catégories d'âge
      labels: {
        style: {
          colors: "white", // Couleur des étiquettes sur l'axe des X
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "white", // Couleur des étiquettes sur l'axe des Y
        },
      },
      tickAmount: 5, // Spécifie le nombre de divisions sur l'axe des Y
      min: 0, // Définit la valeur minimale sur l'axe des Y
      max: 10, // Définit la valeur maximale sur l'axe des Y
      tickPlacement: "between", // Affiche les étiquettes entre les barres
      tickInterval: 3, // Interval entre chaque étiquette
    },
  };
  const options2 = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: Object.keys(atcdCounts), // Utilisation des clés de ageCounts comme catégories d'âge
      labels: {
        style: {
          colors: "white", // Couleur des étiquettes sur l'axe des X
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "white", // Couleur des étiquettes sur l'axe des Y
        },
      },
      tickAmount: 5, // Spécifie le nombre de divisions sur l'axe des Y
      min: 0, // Définit la valeur minimale sur l'axe des Y
      max: 10, // Définit la valeur maximale sur l'axe des Y
      tickPlacement: "between", // Affiche les étiquettes entre les barres
      tickInterval: 3, // Interval entre chaque étiquette
    },
  };

  const options3 = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: Object.keys(genderCounts),
    colors: ["#008FFB", "#f08675"],
    dataLabels: {
      enabled: true,
      style: {
        colors: ["white"],
      },
    },
    theme: {
      mode: "light",
    },
  };

  return (
    <>
      <div className="charts">
        <div className="charts-card">
          <h2 className="chart-title">Repartition par âge</h2>
          <ReactApexChart
            options={options}
            series={[{ data: Object.values(ageCounts) }]} // Utilisation des valeurs de ageCounts comme données du graphique
            type="bar"
            height={350}
            ref={chartRef}
          />
        </div>

        <div className="charts-card">
          <h2 className="chart-title">Repartition par Antecedent</h2>
          <ReactApexChart
            options={options2}
            series={[{ data: Object.values(atcdCounts) }]} // Utilisation des valeurs de ageCounts comme données du graphique
            type="bar"
            height={350}
            ref={chartRef}
          />
        </div>
        <div className="charts-card">
          <h2 className="chart-title">Repartition par Genre</h2>
          <ReactApexChart
            options={options3}
            series={Object.values(genderCounts)}
            type="pie"
            height={350}
          />
        </div>
      </div>
      <div></div>
    </>
  );
}

export default StatistiqueAll;

import React, { useEffect, useState } from "react";
import { useAppcontext } from "../../context/appContext";
import { FaUser } from "react-icons/fa";
import Chart from "chart.js/auto";

function HistoriqueParamsVitaux() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { FileJson, name, lastName, genre } = useAppcontext();
  const destroyECGChart = () => {
    if (
      window.ecgChart instanceof Chart &&
      typeof window.ecgChart.destroy === "function"
    ) {
      window.ecgChart.destroy();
      window.ecgChart = null;
    }
  };
  useEffect(() => {
    renderECGChart();

    return () => {
      destroyECGChart();
    };
  }, [selectedIndex]);

  const renderECGChart = () => {
    if (selectedIndex !== null && FileJson[selectedIndex].ecg) {
      const ecgData = FileJson[selectedIndex].ecg;
      const labels = Array.from({ length: ecgData.length }, (_, i) => i + 1);
      const ctx = document.getElementById("ecgChart").getContext("2d");

      destroyECGChart();

      window.ecgChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "ECG",
              data: ecgData,
              borderColor: "#2fc90c",
              backgroundColor: "transparent",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Temps (ms)",
                color: "white", // Couleur de l'axe des abscisses
              },
              grid: {
                color: "lightgrey", // Couleur de la grille
              },
            },
            y: {
              title: {
                display: true,
                text: "Amplitude (mV)",
                color: "white", // Couleur de l'axe des ordonnées
              },
              grid: {
                color: "lightgrey", // Couleur de la grille
              },
              ticks: {
                stepSize: 0.5, // Espacement des lignes de référence
                min: -2, // Valeur minimale de l'axe y
                max: 2, // Valeur maximale de l'axe y
                color: "white", // Couleur des lignes de référence
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                color: "white", // Couleur de la légende
              },
            },
          },
        },
      });
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return date.toLocaleDateString("fr-FR", options); // 'fr-FR' pour le format de date français
  }

  function handleDateChange(event) {
    const selectedIndex = parseInt(event.target.value);
    setSelectedIndex(selectedIndex !== -1 ? selectedIndex : null);
  }

  return (
    <div>
      <main className="main-container">
        <h1 style={{ color: "black" }}>Historique des Paramètres Vitaux</h1>
        <div className="main-title">
          <h3 style={{ color: "black" }}>
            <FaUser /> :{name} {lastName}{" "}
            <span style={{ margin: "0 10px" }}></span>
            Genre :{genre}
          </h3>
        </div>
        <div>
          <select onChange={handleDateChange}>
            <option value={-1}>Sélectionnez une date</option>
            {FileJson.map((item, index) => (
              <option key={index} value={index}>
                {formatDate(item.createdAt)}
              </option>
            ))}
          </select>
        </div>
        {selectedIndex !== null ? (
          <div>
            <h2 style={{ color: "black" }}>
              Paramètres pour la date sélectionnée (
              {formatDate(FileJson[selectedIndex].createdAt)}):
            </h2>
            <ul>
              <li>
                <div className="card">
                  <div className="card-inner">
                    <h3>Fréquence cardiaque</h3>
                    <h1>{FileJson[selectedIndex].frequenceCardiaque}bpm</h1>
                  </div>
                </div>
                <div className="card">
                  <div className="card-inner">
                    <h3>Fréquence respiratoire</h3>
                    <h1>{FileJson[selectedIndex].frequenceRespiratoire}cpm</h1>
                  </div>
                </div>
                <div className="card">
                  <div className="card-inner">
                    {" "}
                    <h3>Glycémie</h3>
                    <h1>{FileJson[selectedIndex].glycemie}mg/L</h1>
                  </div>
                </div>
                <div className="card">
                  <div className="card-inner">
                    <h3>Saturation d'oxygène</h3>
                    <h1> {FileJson[selectedIndex].saturationOxygene}%</h1>
                  </div>
                </div>
                <div className="card">
                  <div className="card-inner">
                    <h3> Température</h3>
                    <h1>{FileJson[selectedIndex].temperature}°C</h1>
                  </div>
                </div>
                <div className="card">
                  <div className="card-inner">
                    <h3>Tension artérielle</h3>
                    <h1>
                      Systolic{" "}
                      {FileJson[selectedIndex].tensionArterielle.systolique}mmHg
                      Diastolic<span style={{ margin: "0 10px" }}></span>
                      {FileJson[selectedIndex].tensionArterielle.diastolique}
                      mmHg
                    </h1>
                  </div>
                </div>
                <canvas id="ecgChart"></canvas>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <h2>Aucune date sélectionnée</h2>
          </div>
        )}
      </main>
    </div>
  );
}

export default HistoriqueParamsVitaux;

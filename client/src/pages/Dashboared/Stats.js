import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import "../../assets/wrappers/stats.css";
import { useAppcontext } from "../../context/appContext";

import { VscDebugStart } from "react-icons/vsc";

import OS from "../../assets/images/icons-medical/saturation-doxygene.png";
import gl from "../../assets/images/icons-medical/lecteur-de-glycemie.png";
import temp from "../../assets/images/icons-medical/high-temperature-icon.png";
import systemeRespiratoire from "../../assets/images/icons-medical/systeme-respiratoire.png";
import pressionArterielle from "../../assets/images/icons-medical/pression-arterielle.png";
import rythmeCardiaque from "../../assets/images/icons-medical/rythme-cardiaque.png";
import { PiMonitorPlayBold } from "react-icons/pi";
import { Link } from "react-router-dom";

function Stats() {
  const {
    editPatientId,
    name,
    lastName,
    genre,
    age,
    vitaux,
    updateParamsViatux,
    getParamsVitauxByPatinetID,
    getParamsViatuxByPatientIdFileJson,
  } = useAppcontext();

  const [patientData, setPatientData] = useState(null);

  const {
    ecg,
    temperature,
    saturationOxygene,
    tensionArterielle,
    glycemie,
    frequenceRespiratoire,
    frequenceCardiaque,
  } = vitaux || {};
  const [exmple, setexmple] = useState(null);
  const [loading, setLoading] = useState(true);

  const ecgChartRef = useRef(null);
  if (!vitaux) {
    console.log("no params viatux");
  }
  if (vitaux) {
    console.log(vitaux);
  }

  useEffect(() => {
    if (editPatientId) {
      setPatientData({
        ecg,
      });
      setexmple(null);
    }
    if (editPatientId) {
      setexmple({
        temperature,
        saturationOxygene,
        tensionArterielle,
        glycemie,
        frequenceRespiratoire,
        frequenceCardiaque,
      });
    }
  }, [
    editPatientId,
    temperature,
    saturationOxygene,
    tensionArterielle,
    glycemie,
    frequenceRespiratoire,
    frequenceCardiaque,
  ]);

  useEffect(() => {
    if (patientData && ecgChartRef.current) {
      createECGChart();
    }
  }, [patientData]);
  useEffect(() => {
    if (exmple) {
      console.log("Paramètres vitaux mis à jour :", exmple);
    }
  }, [exmple]);
  useEffect(() => {
    if (vitaux) {
      setLoading(false);
    }
  }, [vitaux]);
  const handleLive = async (editPatientId) => {
    setLoading(true);
    console.log(`id patient ${editPatientId}`);
    console.log("Updating vital parameters...");
    try {
      await updateParamsViatux(editPatientId);
      let newData = await getParamsVitauxByPatinetID(editPatientId);
      console.log("new data", newData);
      setTimeout(() => {
        console.log("Fetching updated vital parameters...");

        setexmple({
          temperature: newData.temperature,
          saturationOxygene: newData.saturationOxygene,
          tensionArterielle: newData.tensionArterielle,
          glycemie: newData.glycemie,
          frequenceRespiratoire: newData.frequenceRespiratoire,
          frequenceCardiaque: newData.frequenceCardiaque,
        });
        setPatientData({
          ecg: newData.ecg,
        });
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to update vital parameters:", error);
      setLoading(false);
    }
  };
  if (!vitaux) {
    return (
      <h1>
        En attente des données des paramètres vitaux...
        <button
          type="button"
          className="btn edit-btn"
          style={{ fontSize: "24px", padding: "10px" }}
          onClick={async () => handleLive(editPatientId)}
        >
          <PiMonitorPlayBold style={{ fontSize: "inherit" }} />
          <span style={{ marginRight: "5px" }}> </span>
          Live Monitor
        </button>
      </h1>
    );
  }
  if (!exmple || loading) {
    return <h1>Chargement des données...</h1>;
  }

  if (
    exmple.temperature === 0 &&
    exmple.saturationOxygene === 0 &&
    exmple.tensionArterielle.systolique === 0 &&
    exmple.tensionArterielle.diastolique === 0 &&
    exmple.glycemie === 0 &&
    exmple.frequenceRespiratoire === 0 &&
    exmple.frequenceCardiaque === 0
  ) {
    return (
      <h1>
        En attente des données des paramètres vitaux...
        <button
          type="button"
          className="btn edit-btn"
          style={{ fontSize: "24px", padding: "10px" }}
          onClick={async () => handleLive(editPatientId)}
        >
          <PiMonitorPlayBold style={{ fontSize: "inherit" }} />
          <span style={{ marginRight: "5px" }}> </span>
          Live Monitor
        </button>
      </h1>
    );
  }

  const createECGChart = () => {
    if (!patientData || !patientData.ecg) {
      // Patient data or ECG data is not available, return or handle accordingly
      return;
    }
    const ctx = ecgChartRef.current.getContext("2d");
    if (ecgChartRef.current.chart) {
      ecgChartRef.current.chart.destroy();
    }
    new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: patientData.ecg.length }, (_, i) => i + 1),
        datasets: [
          {
            label: "ECG",
            data: patientData.ecg,
            borderColor: "#2fc90c", // Couleur du tracé ECG
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
  };

  if (!patientData || !patientData.ecg) {
    return <h1>No Patient Selected Yet...</h1>;
  }

  return (
    <div>
      <main className="main-container">
        <div className="main-title">
          <h3 className="value">
            Patient :{name} {lastName}
          </h3>
        </div>
        <h3 className="value">Genre :{genre} </h3>
        <h3 className="value">Age :{age}</h3>

        <button
          type="button"
          className="btn edit-btn"
          style={{ fontSize: "24px", padding: "10px" }}
          onClick={async () => handleLive(editPatientId)}
        >
          <PiMonitorPlayBold style={{ fontSize: "inherit" }} />
          <span style={{ marginRight: "5px" }}> </span>
          Live Monitor
        </button>
        <span style={{ margin: "0 10px" }}></span>
        <Link
          style={{ fontSize: "24px", padding: "10px" }}
          to="/HistoriqueVitaux"
          className="btn edit-btn"
          onClick={() => getParamsViatuxByPatientIdFileJson(editPatientId)}
        >
          Historique Params Viatux
        </Link>

        <canvas id="ecgChart" ref={ecgChartRef}></canvas>

        <div className="main-cards">
          <div className="card">
            <div className="card-inner">
              <h3>Temperature</h3>
            </div>
            <h1 className="value">{exmple.temperature}°C</h1>
            <img src={temp} alt="temperature" className="os-image" />
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Tension Arterielle</h3>
              <img
                src={pressionArterielle}
                alt="Oxygen Saturation"
                className="os-image"
              />

              {/* <BsFillGrid3X3GapFill className="card_icon" /> */}
            </div>
            <div className="card-content">
              {exmple.tensionArterielle && (
                <>
                  <h4 className="value">
                    Systolic {exmple.tensionArterielle.systolique}mmHg
                  </h4>
                  <span style={{ margin: "0 10px" }}></span>
                  <h4 className="value">
                    Diastolic {exmple.tensionArterielle.diastolique}mmHg
                  </h4>
                </>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Saturation En Oxygene</h3>

              <img src={OS} alt="Oxygen Saturation" className="os-image" />
            </div>
            <h1 className="value">{exmple.saturationOxygene}%</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Glycemie</h3>
              <img src={gl} alt="Oxygen Saturation" className="os-image" />
            </div>
            <h1 className="value">{exmple.glycemie}mg/L</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>frequence Respiratoire</h3>
            </div>
            <h1 className="value">{exmple.frequenceRespiratoire}cpm</h1>
            <img
              src={systemeRespiratoire}
              alt="Oxygen Saturation"
              className="os-image"
            />
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>frequence Cardique</h3>
            </div>
            <h1 className="value">{exmple.frequenceCardiaque}bpm</h1>
            <img
              src={rythmeCardiaque}
              alt="Oxygen Saturation"
              className="os-image"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Stats;

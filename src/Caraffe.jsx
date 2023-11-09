import React, { useEffect, useState } from 'react';
import sostanze from './data/sostanze.json';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';

export default function Caraffe({ lista, setLista, car, setCar }) {
  const [sostanzeData, setSostanzeData] = useState({});

  useEffect(() => {
    setSostanzeData(sostanze);
  }, []);

  const getEtichettaENota = (caratteristica) => {
    const sostanza = sostanzeData[caratteristica];
    if (sostanza) {
      return {
        etichetta: sostanza.etichetta,
        nota: sostanza.nota || '',
      };
    }
    return {
      etichetta: caratteristica,
      nota: '',
    };
  };

  const remove = (asin) => {
    setLista(lista.filter((el) => el.asin !== asin));
  };

  const Rating = ({ stars }) => {
    let rating = [];
    let fullIcon = Math.floor(stars);
    let halfIcon = stars % 1 === 0.5;

    for (let i = 0; i < fullIcon; i++) {
      rating.push(<BsStarFill className="rating-star" key={i} />);
    }

    if (halfIcon) {
      rating.push(<BsStarHalf className="rating-star" key={stars + 1} />);
    }

    return <div>{rating}</div>;
  };

  useEffect(() => {
    const resizeHandler = () => {
      const elements = document.querySelectorAll('.product-col');
      let maxHeight = 0;
      let totalWidth = 0;

      elements.forEach((element) => {
        element.style.height = 'auto'; // Reset height before recalculating
        const elementHeight = element.offsetHeight;

        totalWidth +=
          element.offsetWidth +
          parseFloat(window.getComputedStyle(element).marginRight);

        if (elementHeight > maxHeight) {
          maxHeight = elementHeight;
        }
      });

      elements.forEach((element) => {
        element.style.height = `${maxHeight}px`;
      });

      const container = document.querySelector('.scroll-container');
      if (container) {
        container.style.height = `${maxHeight + 25}px`;
      }
      const itemscontainer = document.querySelector('.items-container');
      if (itemscontainer) {
        itemscontainer.style.height = `${maxHeight}px`;
        itemscontainer.style.width = `${totalWidth}px`;
      }
    };

    window.addEventListener('resize', resizeHandler);
    resizeHandler(); // Call the function on initial load

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [lista]);

  return (
    <div className="product-grid my-40">
      <div className="intro pr-5">
        Scorri orizzontalmente il riquadro a destra per visualizzare i diversi
        prodotti.
        <br />
        Puoi scartare un prodotto premendo la X, mentre cliccando nel riquadro
        lo selezionerai per il calcolatore.
        <br />
        <br />
        L'ordine è sempre casuale, per non influenzare la tua decisione!
        <small>
          <br />
          <br />
          in fondo metti pulsante "usa per confronto" e "acquista" in
          arancio-amazon
          <br />
          tabelle con sì, no, sì (parzialmente) check verde, check grigio, check
          rosso
        </small>
      </div>
      <div className="items">
        <div className="scroll-container">
          <div className="items-container">
            {lista.flatMap((entry) =>
              entry.filtri.length > 1 ? (
                entry.filtri.map((filtro) => (
                  <div
                    key={entry.asin + '_' +filtro.nome.toLowerCase().replace(/ /g, '')}
                    className={`product-col p-4 border border-white rounded-lg text-center shadow ${
                      (entry.asin === car || entry.asin + '_' +filtro.nome.toLowerCase().replace(/ /g, '') === car || lista.length === 1) && ` selected`
                    }`}
                    onClick={() => setCar(entry.asin+ '_'+ filtro.nome.toLowerCase().replace(/ /g, ''))}
                  >
                    <div style={{ height: 60 }}>
                      <h2 className="text-xl">{entry.custom_title}</h2>
                      <p>{filtro.nome}</p>
                    </div>

                    <div className="img-container rounded-md my-12">
                      <img
                        src={entry.image}
                        className="max-w-full"
                        alt={entry.title}
                      />
                    </div>
                    <p>€ {JSON.stringify(entry.price)}</p>
                    <p className="rating">
                      Rating: <Rating stars={entry.rating} />{' '}
                      <span>({entry.rating_num})</span>
                    </p>
                    <div className="caratteristiche mt-5" key={filtro.nome}>
                      <table className="mx-auto">
                        {Object.entries(filtro.caratteristiche).map(
                          ([caratteristica, valore]) => {
                            const { etichetta, nota } =
                              getEtichettaENota(caratteristica);
                            return (
                              <React.Fragment key={caratteristica}>
                                <tr>
                                  <td style={{ textAlign: 'left' }}>
                                    {etichetta}
                                  </td>
                                  <td>
                                    {valore === 1
                                      ? '✅'
                                      : valore === 0
                                      ? '❌'
                                      : '✓'}
                                  </td>
                                </tr>
                                {nota && (
                                  <tr>
                                    <td
                                      colSpan="2"
                                      style={{ display: 'table-cell' }}
                                    >
                                      <small>{nota}</small>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          }
                        )}
                      </table>
                    </div>

                    <a href={entry.link} target="_blank" rel="noreferrer">
                      <button className="bg-gray-800 p-1 px-4 mt-5">
                        ACQUISTA
                      </button>
                    </a>
                    {lista.length > 1 && (
                      <span
                        className="close"
                        onClick={() => remove(entry.asin)}
                        title="Scarta"
                      >
                        &times;
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div
                  key={entry.asin}
                  className={`product-col p-4 border border-white rounded-lg text-center shadow ${
                    (entry.asin === car || lista.length === 1) && ` selected`
                  }`}
                  onClick={() => setCar(entry.asin)}
                >
                  <h2 className="text-xl" style={{ height: 60 }}>
                    {entry.custom_title}
                  </h2>
                  <div className="img-container rounded-md">
                    <img
                      src={entry.image}
                      className="max-w-full"
                      alt={entry.title}
                    />
                  </div>
                  <p>€ {JSON.stringify(entry.price)}</p>
                  <p className="rating">
                    Rating: <Rating stars={entry.rating} />{' '}
                    <span>({entry.rating_num})</span>
                  </p>
                  {entry.nota && <small>{entry.nota}</small>}
                  <div className="caratteristiche mt-5" >
                    <table className="mx-auto">
                      {Object.entries(entry.filtri[0].caratteristiche).map(
                        ([caratteristica, valore]) => {
                          const { etichetta, nota } =
                            getEtichettaENota(caratteristica);
                          return (
                            <React.Fragment key={caratteristica}>
                              <tr>
                                <td style={{ textAlign: 'left' }}>
                                  {etichetta}
                                </td>
                                <td>
                                  {valore === 1
                                    ? '✅'
                                    : valore === 0
                                    ? '❌'
                                    : '✓'}
                                </td>
                              </tr>
                              {nota && (
                                <tr>
                                  <td
                                    colSpan="2"
                                    style={{ display: 'table-cell' }}
                                  >
                                    <small>{nota}</small>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        }
                      )}
                    </table>
                  </div>
                  <a href={entry.link} target="_blank" rel="noreferrer">
                    <button className="bg-gray-800 p-1 px-4 mt-5">
                      ACQUISTA
                    </button>
                  </a>
                  {lista.length > 1 && (
                    <span
                      className="close"
                      onClick={() => remove(entry.asin)}
                      title="Scarta"
                    >
                      &times;
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

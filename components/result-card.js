import { useState } from "react";
import { formatDistance } from "date-fns";
import id from "date-fns/locale/id";

const ResultCard = ({ result }) => {
  const [showRelative, setShowRelative] = useState(true);

  return (
    <>
      <div>
        {typeof result === "string" ? (
          <>
            <h1>{result}</h1>
            <h2>Tidak ditemukan</h2>
          </>
        ) : (
          <>
            <label>
              <b>{result["registration"]}</b> ·{"  "}
              <time>
                {showRelative
                  ? `Terdaftar ${formatDistance(
                      new Date(result["registered_at"].seconds * 1000),
                      new Date(),
                      { locale: id }
                    )} lalu`
                  : `Terdaftar pada ${new Date(
                      result["registered_at"].seconds * 1000
                    ).toLocaleDateString()}`}
              </time>
              <span
                onClick={() => {
                  setShowRelative(!showRelative);
                }}
              >
                {" "}
                ⏱(klik)
              </span>
              {result["is_syariah"] ? (
                <>
                  <span>{" · "}Syariah ☪️</span>
                </>
              ) : null}
            </label>
            <h1>
              {typeof result === "string" ? result : result["platform_name"]}
            </h1>
            <h2>{result["company_name"]}</h2>
            <label className="address-label">Alamat</label>
            <address
              dangerouslySetInnerHTML={{
                __html: `${result["alamat"] || "Alamat tidak ditemukan."}`
              }}
            />
          </>
        )}
      </div>
      <style jsx>
        {`
          div {
            background: white;
            border-radius: 0.25rem;
            box-shadow: 0 0.5rem 100rem rgba(0, 0, 0, 0.25);
            padding: 1rem;
            margin: 2rem 0;
          }
          h1 {
            margin: 0.5rem 0;
          }
          h2 {
            margin-bottom: 2rem;
          }
          label {
            margin: 1rem 0;
          }
          .address-label {
            text-transform: uppercase;
            color: rgba(0, 0, 0, 0.5);
          }
          address {
            margin: 0.5rem 0;
          }
        `}
      </style>
    </>
  );
};

export default ResultCard;

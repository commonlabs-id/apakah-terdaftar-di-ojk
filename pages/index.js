import { useState } from "react";
import Head from "next/head";
import Fuse from "fuse.js";
import debounce from "debounce-fn";
import { formatDistance } from "date-fns";
import id from "date-fns/locale/id";

// const debounce = (func, delay) => {
//   let inDebounce;
//   return function() {
//     const context = this;
//     const args = arguments;
//     clearTimeout(inDebounce);
//     inDebounce = setTimeout(() => func.apply(context, args), delay);
//   };
// };

import ojk from "../static/ojk.json";

const fuseOptions = {
  shouldSort: true,
  tokenize: true,
  includeMatches: true,
  findAllMatches: true,
  includeScore: true,
  matchAllTokens: true,
  minMatchCharLength: 2,
  keys: ["Nama Platform", "Nama Perusahaan"]
};

const fuse = new Fuse(ojk, fuseOptions);

const search = (v, fn) => {
  const result = fuse.search(v).filter(r => r.score <= 0.25);
  fn(result);
};

const debouncedSearch = debounce(search, { wait: 300 });

const SearchSuggestionItem = ({ handler, company, platform }) => (
  <>
    <li onClick={handler}>
      {company} ({platform})
    </li>
    <style jsx>{`
      li {
        background: white;
        padding: 1rem;
        cursor: pointer;
      }
      li:hover {
        background: black;
        color: white;
      }
    `}</style>
  </>
);
const SearchWithDropdown = ({
  setResult,
  setIsRegistered,
  value,
  setValue
}) => {
  const [res, setRes] = useState([]);
  const changeHandler = e => {
    setResult(undefined);
    setIsRegistered(undefined);
    setValue(e.target.value);
    debouncedSearch(e.target.value, setRes);
  };

  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!value) return;
          const hasResult = res.length > 0;
          const hasSubstr =
            hasResult &&
            res[0].item["Nama Platform"].toLowerCase().includes(value);
          setResult(hasSubstr ? res[0].item : value);
          setValue("");
          setIsRegistered(hasSubstr);
          setRes([]);
        }}
      >
        <input
          value={value}
          onChange={changeHandler}
          placeholder={"Masukkan nama aplikasi (Kredit Hiu)"}
        />
        <input className="button" type="submit" value="Check" />
        <style jsx>{`
          form {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          input {
            flex: 7;
            font-family: "Inter";
            font-size: 1.25rem;
            padding: 0.5rem;
            border-radius: 0.25rem;
            border: none;
            box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5);
            margin: 1rem 1rem 1rem 0;
            align-self: center;
            max-width: 46rem;
            width: 100%;
          }
          .button {
            margin: 0;
            flex: 1;
            border: none;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 0.25rem;
            padding: 0.5rem;
            color: rgba(255, 255, 255, 0.9);
            font-family: "Inter";
            font-size: 1.25rem;
            cursor: pointer;
          }
          .button:hover {
            background: rgba(0, 0, 0, 0.7);
          }
          @media (min-width: 1024px) {
            input {
              font-size: 1.5rem;
              padding: 1rem;
            }
            .button {
              padding: 0.5rem;
              font-size: 1.5rem;
            }
          }
        `}</style>
      </form>
      {res.length > 0 ? (
        <ul>
          {res.map(r => {
            const { item, matches } = r;
            if (matches.length < 1) {
              return (
                <SearchSuggestionItem
                  key={item["Nama Platform"]}
                  company={item["Nama Perusahaan"]}
                  platform={item["Nama Platform"]}
                />
              );
            } else {
              let chunks = {
                "Nama Perusahaan": [],
                "Nama Platform": []
              };
              matches.forEach(m => {
                const str = item[m.key].split("");
                let i = 0;
                m.indices.forEach(index => {
                  const [beginning, endMinusOne] = index;
                  const end = endMinusOne + 1;
                  if (i < beginning) {
                    chunks[m.key].push(str.slice(i, beginning).join(""));
                  }
                  const highlighted = str.slice(beginning, end).join("");
                  chunks[m.key].push(<b>{highlighted}</b>);
                  i = end;
                });
                chunks[m.key].push(str.slice(i).join(""));
              });
              return (
                <SearchSuggestionItem
                  key={item["Nama Platform"]}
                  handler={() => {
                    const isActive = res.length > 0;
                    setResult(item);
                    setValue("");
                    setIsRegistered(isActive);
                    setRes([]);
                  }}
                  company={
                    chunks["Nama Perusahaan"].length > 0
                      ? chunks["Nama Perusahaan"]
                      : item["Nama Perusahaan"]
                  }
                  platform={
                    chunks["Nama Platform"].length > 0
                      ? chunks["Nama Platform"]
                      : item["Nama Platform"]
                  }
                />
              );
            }
          })}
          <style jsx>
            {`
              ul {
                list-style: none;
                padding: 0;
                margin: 0;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
              }
            `}
          </style>
        </ul>
      ) : null}
    </>
  );
};

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
              <b>{result["Nomor Surat Terdaftar atau Izin"]}</b> ·{"  "}
              <time>
                {showRelative
                  ? `Terdaftar ${formatDistance(
                      new Date(result["Tanggal Terdaftar atau Izin"]),
                      new Date(),
                      { locale: id }
                    )} lalu`
                  : `Terdaftar pada ${new Date(
                      result["Tanggal Terdaftar atau Izin"]
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
              {result["Jenis Usaha"] === "Syariah" ? (
                <>
                  <span>{" · "}Syariah ☪️</span>
                </>
              ) : null}
            </label>
            <h1>
              {typeof result === "string" ? result : result["Nama Platform"]}
            </h1>
            <h2>{result["Nama Perusahaan"]}</h2>
            <label className="address-label">Alamat</label>
            <address
              dangerouslySetInnerHTML={{ __html: `${result["Alamat"]}` }}
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

const Toast = () => {
  const [show, setShow] = useState(true);
  return (
    <>
      {show ? (
        <span>
          Anda korban Pinjol Ilegal? Hubungi{" "}
          <a href="https://www.bantuanhukum.or.id/web/formulir-pengaduan-pos-korban-pinjaman-online-pinjol/">
            LBH Jakarta
          </a>
          !{" "}
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              setShow(false);
            }}
          >
            (tutup)
          </a>
        </span>
      ) : null}
      <style jsx>
        {`
          span {
            padding: 1rem;
            margin: 1rem;
            max-width: 46rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            background: black;
            color: white;
          }
          a {
            color: rgba(255, 255, 255, 0.8);
          }
        `}
      </style>
    </>
  );
};

const Index = () => {
  const [value, setValue] = useState("");
  const [result, setResult] = useState(undefined);
  const [isRegistered, setIsRegistered] = useState(undefined);
  return (
    <>
      <Head>
        <title>Apakah aplikasi fintech ini terdaftar di OJK</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="twitter:site" content="@zeithq" />
        <meta
          name="og:title"
          content="Apakah aplikasi fintech ini terdaftar di OJK"
        />
        <meta
          name="og:url"
          content="https://apakah-terdaftar-di-ojk.netlify.com"
        />
        <meta
          name="description"
          content="Cari tahu apakah suatu aplikasi fintech terdaftar di OJK"
        />
        <meta
          name="og:description"
          content="Cari tahu apakah suatu aplikasi fintech terdaftar di OJK"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="og:image"
          content="https://apakah-terdaftar-di-ojk.netlify.com/static/twitter-card.png"
        />
      </Head>
      <main>
        <h1>
          Apakah{" "}
          {
            <u>
              {value ||
                ((result && result["Nama Platform"]) || result) ||
                "_____"}
            </u>
          }{" "}
          terdaftar di <b>OJK</b>?{" "}
          {result ? (isRegistered ? "✅" : "🚫") : null}
        </h1>
        {result ? (
          <h2>
            {isRegistered ? "✅ Ya," : "🚫 Tidak,"} platform ini{" "}
            {isRegistered ? "" : "tidak "} terdaftar di OJK.
          </h2>
        ) : null}
        {result ? <ResultCard result={result} /> : null}
        <SearchWithDropdown
          value={value}
          setValue={setValue}
          setResult={setResult}
          setIsRegistered={setIsRegistered}
        />
      </main>
      <Toast />
      <footer>
        Data diperoleh dari{" "}
        <a href="https://www.ojk.go.id/id/kanal/iknb/data-dan-statistik/direktori/fintech/Default.aspx">
          Situs OJK
        </a>
        . Pembaharuan terakhir: Juni 2018. Dibuat oleh{" "}
        <a href="https://twitter.com/mathdroid">mathdroid</a>. Kode sumber:{" "}
        <a href="https://github.com/mathdroid/apakah-terdaftar-di-ojk">
          Github
        </a>
      </footer>
      <style jsx global>{`
        @font-face {
          font-family: "Inter";
          font-style: normal;
          font-weight: 400;
          src: url("/static/Inter-Regular.woff") format("woff");
        }
        @font-face {
          font-family: "Inter";
          font-style: normal;
          font-weight: 900;
          src: url("/static/Inter-Black.woff") format("woff");
        }
        html {
          box-sizing: border-box;
        }
        * {
          box-sizing: inherit;
        }
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100%;
        }
        html {
          font-family: "Inter", monospace;
          background: #fafafa;
        }
        h1,
        h2 {
          font-family: "Inter", monospace;
          font-weight: 400;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        u {
          font-weight: 900;
        }
        #__next {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          height: 100%;
          min-height: 100vh;
        }
        @media (min-width: 1024px) {
          h1 {
            font-size: 4rem;
          }
        }
      `}</style>
      <style jsx>{`
        main {
          display: flex;
          flex: 1 1 auto;
          max-width: 48rem;
          min-height: 70vh;
          padding: 1.5rem;
          flex-direction: column;
        }
        footer {
          margin-top: 2rem;
          padding: 1.5rem;
        }
      `}</style>
    </>
  );
};

export default Index;

import { useState } from "react";
import Fuse from "fuse.js";
import debounce from "debounce-fn";
import fetch from "isomorphic-unfetch";

import ResultCard from "../components/result-card";
import SEO from "../components/seo";
import SiteFooter from "../components/site-footer";
import Toast from "../components/toast";
import useSearch from "../components/useSearch";

const fuseOptions = {
  shouldSort: true,
  tokenize: true,
  includeMatches: true,
  findAllMatches: true,
  includeScore: true,
  matchAllTokens: true,
  minMatchCharLength: 2,
  keys: ["platform_name", "company_name"]
};

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
  setSearch,
  platforms
}) => {
  const changeHandler = e => {
    setResult(undefined);
    setIsRegistered(undefined);
    setSearch(e.target.value);
  };
  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!value) return;
          const hasResult = platforms.length > 0;
          const hasSubstr =
            hasResult &&
            platforms[0].item["platform_name"].toLowerCase().includes(value);
          setResult(hasSubstr ? platforms[0].item : value);
          setSearch("");
          setIsRegistered(hasSubstr);
        }}
      >
        <input
          value={value}
          onChange={changeHandler}
          placeholder={"Masukkan nama aplikasi (Kredit Hiu)"}
        />
        <p>{platforms.length}</p>
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
              padding: 1rem;
              font-size: 1.5rem;
            }
          }
        `}</style>
      </form>
      {platforms.length > 0 ? (
        <ul>
          {platforms.map(r => {
            const { item, matches = [] } = r;
            if (matches.length < 1) {
              return null;
            } else {
              let chunks = {
                company_name: [],
                platform_name: []
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
                  key={item["platform_name"]}
                  handler={() => {
                    const isActive = platforms.length > 0;
                    setResult(item);
                    setSearch("");
                    setIsRegistered(isActive);
                  }}
                  company={
                    chunks["company_name"].length > 0
                      ? chunks["company_name"]
                      : item["company_name"]
                  }
                  platform={
                    chunks["platform_name"].length > 0
                      ? chunks["platform_name"]
                      : item["platform_name"]
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

const Index = ({ platformsData }) => {
  const [value, setValue] = useState("");
  const [result, setResult] = useState(undefined);
  const [isRegistered, setIsRegistered] = useState(undefined);

  const [platforms, setSearch] = useSearch(platformsData, fuseOptions);
  const debouncedSearch = debounce(setSearch, { wait: 100 });
  const search = v => {
    setValue(v);
    debouncedSearch(v);
  };
  return (
    <>
      <SEO />
      <main>
        <h1>
          Apakah{" "}
          {
            <u>
              {value ||
                ((result && result["platform_name"]) || result) ||
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
          setSearch={search}
          setResult={setResult}
          setIsRegistered={setIsRegistered}
          platforms={platforms}
        />
      </main>
      <Toast />
      <SiteFooter />
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
        html,
        body {
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
      `}</style>
    </>
  );
};

Index.getInitialProps = async function() {
  const res = await fetch("https://pinjollist.now.sh/api/companies");
  const { data: platformsData } = await res.json();
  const indexer = new Fuse(platformsData, fuseOptions);
  // console.log(platformsData);
  console.log(`Platforms data fetched. Count: ${platformsData.length}`);

  return {
    platformsData
  };
};

export default Index;

const SiteFooter = () => (
  <>
    <footer>
      Data diperoleh dari{" "}
      <a href="https://www.ojk.go.id/id/kanal/iknb/data-dan-statistik/direktori/fintech/Default.aspx">
        Situs OJK
      </a>
      . Pembaharuan terakhir: Juni 2018. Dibuat oleh{" "}
      <a href="https://twitter.com/mathdroid">mathdroid</a>. Kode sumber:{" "}
      <a href="https://github.com/mathdroid/apakah-terdaftar-di-ojk">Github</a>
    </footer>
    <style jsx>
      {`
        footer {
          margin-top: 2rem;
          padding: 1.5rem;
        }
      `}
    </style>
  </>
);

export default SiteFooter;

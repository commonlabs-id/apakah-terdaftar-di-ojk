const SiteFooter = () => (
  <>
    <footer>
      Data diperoleh dari{" "}
      <a href="https://ojk.go.id/id/berita-dan-kegiatan/publikasi/Pages/Penyelenggara-Fintech-Terdaftar-di-OJK-per-Februari-2019.aspx">
        Situs OJK
      </a>
      . Pembaharuan terakhir: Februari 2019. Dibuat oleh{" "}
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

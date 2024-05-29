const defaultSettings = {
  enableRouting: true,
  enableDownloads: true,
  folderSettings: [
    {
      fileType:
        "jpg, jpeg, peg, png, gif, tiff, tif, svg, bmp, ai, ico, icns, ppm, pgm, pnm, pbm, bgp, webp",
      folder: "pictures",
    },
    {
      fileType:
        "mp3, aac, wav, ogg, flac, wma, ac3, pcm, aiff, alac, wpl, aa, act, ape, m4a, m4p, oga, mogg, tta",
      folder: "music",
    },
    {
      fileType:
        "mkv, avi, 3gp, 3g2, mov, bik, wmv, flv, swf, m2v, m2p, vob, ifo, mp4, m4v, mpg, asf, mpeg, mpv, qt, webm, ogv",
      folder: "videos",
    },
    {
      fileType:
        "exe, apk, com, deb, msi, dmg, bin, vcd, pl, cgi, jar, py, wsf, ipa",
      folder: "programs",
    },
    {
      fileType:
        "txt, rtf, odt, tex, wks, wps, ods, xlr, xlt, xls, xlsx, xml, key, rss, cer, csv, mobileprovision",
      folder: "documents",
    },
    {
      fileType: "djvu, fb2, fb3, mobi, epub, azw, lit, odf, kfx",
      folder: "books",
    },
    { fileType: "zip, rar, 7z, gzip, gz, tar, arj, rpm", folder: "archives" },
    { fileType: "iso, adf, cso, md0, md1, md2, mdf", folder: "images" },
    {
      fileType: "bak, cab, cfg, cpl, cur, dll, dmp, drv, ini, lnk, sys, tmp",
      folder: "system",
    },
    { fileType: "fnt, fon, otf, ttf", folder: "fonts" },
    { fileType: "torrent", folder: "torrents" },
    { fileType: "alfredworkflow", folder: "other" },
    { fileType: "html, css", folder: "html" },
    { fileType: "json", folder: "documents/json" },
    { fileType: "docx, doc, docm", folder: "documents/word" },
    { fileType: "ppt, pptx", folder: "documents/ppt" },
    { fileType: "pdf", folder: "documents/pdf" },
    { fileType: "md", folder: "documents/markdown" },
  ],
};

function getDefaultSettings() {
  return defaultSettings;
}

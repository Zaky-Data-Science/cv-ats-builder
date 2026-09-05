import { runAdminTests } from "./admin.test";
import { runAtsEngineTests } from "./ats-engine.test";
import { runCetakTests } from "./cetak.test";
import { runDocumentTests } from "./document.test";
import { runEditPathTests } from "./edit-path.test";
import { runI18nTests } from "./i18n.test";
import { runKertasTests } from "./kertas.test";
import { runKeywordTests } from "./keywords.test";
import { runMarkupTests } from "./markup.test";
import { runPasswordResetTests } from "./password-reset.test";
import { runPdfTests } from "./pdf.test";
import { runPhotoTests } from "./photo.test";
import { runStaleSessionTests } from "./stale-session.test";
import { runStructureTests } from "./structure.test";
import { runTemplateTests } from "./templates.test";
import { summary } from "./harness";

/**
 * Titik masuk seluruh berkas uji.
 *
 * Dijalankan dengan `npm test`. Urutannya sengaja dari yang paling murni ke
 * yang paling banyak bergantung pada hal luar, sehingga bila ada yang gagal,
 * kegagalan pertama biasanya sudah cukup menjelaskan penyebabnya.
 */
async function main() {
  runI18nTests();
  runKeywordTests();
  runEditPathTests();
  runStructureTests();
  runMarkupTests();
  runPasswordResetTests();
  runStaleSessionTests();
  runAdminTests();
  runCetakTests();
  runAtsEngineTests();
  runTemplateTests();
  runKertasTests();
  runDocumentTests();
  await runPhotoTests();
  await runPdfTests();
  summary();
}

void main();


import { runAtsEngineTests } from "./ats-engine.test";
import { runDocumentTests } from "./document.test";
import { runI18nTests } from "./i18n.test";
import { runPdfTests } from "./pdf.test";
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
  runAtsEngineTests();
  runTemplateTests();
  runDocumentTests();
  await runPdfTests();
  summary();
}

void main();

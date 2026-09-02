/**
 * Kerangka uji seadanya - tanpa pustaka pengujian.
 *
 * Alasannya bukan menghindari pustaka, melainkan bahwa yang diuji di sini
 * hampir seluruhnya fungsi murni: masukan tetap, keluaran tetap. Untuk itu,
 * satu fungsi pembanding dan satu penghitung kegagalan sudah cukup - dan
 * berkas uji tetap dapat dijalankan dengan `npx tsx`, tanpa konfigurasi
 * tambahan yang perlu ikut dipelihara.
 *
 * Setiap pemeriksaan mencetak barisnya sendiri, sehingga keluarannya dapat
 * disalin apa adanya ke bab pengujian laporan.
 */

let passed = 0;
let failed = 0;
const failures: string[] = [];

export function section(title: string): void {
  console.log(`\n=== ${title}`);
}

export function check(label: string, condition: boolean, detail = ""): void {
  if (condition) {
    passed += 1;
    console.log(`  lulus  ${label}${detail ? ` - ${detail}` : ""}`);
  } else {
    failed += 1;
    failures.push(`${label}${detail ? ` - ${detail}` : ""}`);
    console.log(`  GAGAL  ${label}${detail ? ` - ${detail}` : ""}`);
  }
}

export function equal<T>(label: string, actual: T, expected: T): void {
  check(
    label,
    Object.is(actual, expected),
    Object.is(actual, expected)
      ? String(actual)
      : `diperoleh ${String(actual)}, seharusnya ${String(expected)}`,
  );
}

export function between(
  label: string,
  actual: number,
  min: number,
  max: number,
): void {
  check(
    label,
    actual >= min && actual <= max,
    `${actual} (rentang ${min}-${max})`,
  );
}

export function summary(): void {
  console.log(
    `\n--------------------------------------------------------------`,
  );
  console.log(`Total: ${passed + failed} pemeriksaan, ${passed} lulus, ${failed} gagal`);
  if (failed > 0) {
    console.log("\nYang gagal:");
    for (const failure of failures) console.log(`  - ${failure}`);
    process.exitCode = 1;
  }
}

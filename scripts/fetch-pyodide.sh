#!/usr/bin/env bash
set -euo pipefail

PYODIDE_VERSION="314.0.7"
PYODIDE_SHA256="2abdcc2e35208af406e07724cffa85bc582ced97e9028383ecf5462541393f95"
PYODIDE_URL="https://github.com/pyodide/pyodide/releases/download/${PYODIDE_VERSION}/pyodide-core-${PYODIDE_VERSION}.tar.bz2"
DESTINATION="${1:-vendor/pyodide/${PYODIDE_VERSION}}"

required=(pyodide.mjs pyodide.asm.mjs pyodide.asm.wasm python_stdlib.zip pyodide-lock.json)
all_present=true
for file in "${required[@]}"; do
  [[ -s "${DESTINATION}/${file}" ]] || all_present=false
done
if [[ "${all_present}" == "true" ]]; then
  echo "Pyodide ${PYODIDE_VERSION} already present in ${DESTINATION}"
  exit 0
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "${tmp_dir}"' EXIT
archive="${tmp_dir}/pyodide-core.tar.bz2"
unpack="${tmp_dir}/unpack"
mkdir -p "${unpack}" "${DESTINATION}"

curl --fail --location --silent --show-error \
  --retry 4 --retry-delay 2 --retry-all-errors \
  "${PYODIDE_URL}" -o "${archive}"

echo "${PYODIDE_SHA256}  ${archive}" | sha256sum --check --status || {
  echo "Pyodide checksum mismatch" >&2
  exit 1
}

tar -xjf "${archive}" -C "${unpack}"
root="$(dirname "$(find "${unpack}" -type f -name pyodide.mjs -print -quit)")"
[[ -n "${root}" && -d "${root}" ]] || {
  echo "Unable to locate extracted Pyodide runtime" >&2
  exit 1
}

for file in "${required[@]}"; do
  [[ -s "${root}/${file}" ]] || {
    echo "Missing ${file} in Pyodide core archive" >&2
    exit 1
  }
done

cp -a "${root}/." "${DESTINATION}/"
echo "Pyodide ${PYODIDE_VERSION} installed in ${DESTINATION}"

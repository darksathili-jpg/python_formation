import { spawnSync } from 'node:child_process';
import { modules, practiceBank, primmBank, capstones } from '../assets/content.js';

const core = modules.flatMap(module => module.exercises.map(ex => ({ ...ex, moduleId: module.id, source: 'core' })));
const extra = practiceBank.map(ex => ({ ...ex, source: 'practice' }));
const apps = capstones.map(ex => ({ ...ex, source: 'capstone' }));
const all = [...core, ...extra, ...apps];

const ids = all.map(ex => ex.id);
if (new Set(ids).size !== ids.length) throw new Error('Identifiants d’exercices dupliqués');
if (practiceBank.length !== 100) throw new Error(`Banque d’entraînement: ${practiceBank.length} au lieu de 100`);
if (primmBank.length !== modules.length) throw new Error(`PRIMM: ${primmBank.length} ateliers pour ${modules.length} modules`);
if (capstones.length !== 9) throw new Error(`Applications intégratives: ${capstones.length} au lieu de 9`);

for (const module of modules) {
  const n = practiceBank.filter(ex => ex.moduleId === module.id).length;
  if (n !== 5) throw new Error(`${module.id}: ${n} entraînements au lieu de 5`);
  if (!primmBank.some(a => a.moduleId === module.id)) throw new Error(`${module.id}: atelier PRIMM manquant`);
}
const kinds = new Set(practiceBank.map(ex => ex.kind));
for (const kind of ['compléter','déboguer','écrire','transfert']) {
  if (!kinds.has(kind)) throw new Error(`Format pédagogique absent: ${kind}`);
}

const cases = all.map(ex => ({
  id: ex.id,
  solution: ex.solution,
  tests: ex.tests
}));

const python = String.raw`
import json, sys, traceback
cases = json.load(sys.stdin)
errors = []
for case in cases:
    ns = {}
    try:
        exec(case["solution"], ns)
    except Exception as exc:
        errors.append(f'{case["id"]}: solution invalide: {type(exc).__name__}: {exc}')
        continue
    for test in case["tests"]:
        label = test.get("label", "test")
        if "raises" in test:
            try:
                eval(test["expr"], ns)
            except Exception as exc:
                if test["raises"] not in type(exc).__name__ and test["raises"] not in str(exc):
                    errors.append(f'{case["id"]} / {label}: {type(exc).__name__} au lieu de {test["raises"]}')
            else:
                errors.append(f'{case["id"]} / {label}: aucune exception, {test["raises"]} attendue')
        else:
            try:
                value = eval(test["expr"], ns)
                if not (value is True or value == 1):
                    errors.append(f'{case["id"]} / {label}: résultat {value!r}')
            except Exception as exc:
                errors.append(f'{case["id"]} / {label}: {type(exc).__name__}: {exc}')
if errors:
    print("\\n".join(errors[:60]), file=sys.stderr)
    sys.exit(1)
print(f'{len(cases)} solutions Python et leurs tests: OK')
`;

const result = spawnSync('python3', ['-c', python], {
  input: JSON.stringify(cases),
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024
});
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.status !== 0) process.exit(result.status || 1);

console.log(`${modules.length} modules · ${core.length} missions cœur · ${practiceBank.length} entraînements · ${primmBank.length} PRIMM · ${capstones.length} applications`);

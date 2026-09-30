import p1 from './content-p1.js';
import p2 from './content-p2.js';
import t1 from './content-t1.js';
import t2 from './content-t2.js';
import practiceBank from './practice-bank.js';
import primmBank from './primm-bank.js';
import capstones from './capstone-bank.js';
import noviceBank from './novice-bank.js';
import { applyNoviceContentFixes } from './novice-overrides.js';
import { applyStudentZeroP1P2 } from './student-zero-p1p2.js';
import { applyStudentZeroP3P4 } from './student-zero-p3p4.js';
import { applyStudentZeroP5P6 } from './student-zero-p5p6.js';
import { applyStudentZeroP7P8 } from './student-zero-p7p8.js';
import { applyStudentZeroP8P9 } from './student-zero-p8p9.js';
import { applyStudentZeroP9T1 } from './student-zero-p9t1.js';
import { applyStudentZeroT1T2 } from './student-zero-t1t2.js';
import { applyStudentZeroT2T3 } from './student-zero-t2t3.js';
import { applyStudentZeroT3T4 } from './student-zero-t3t4.js';
import { applyStudentZeroT4T5 } from './student-zero-t4t5.js';
export { SITE_VERSION, tracks, flashQuestions, sources, scopeNotes } from './content-meta.js';
export const modules = [...p1, ...p2, ...t1, ...t2];
applyNoviceContentFixes(modules, practiceBank, noviceBank);
applyStudentZeroP1P2(modules, practiceBank, primmBank, noviceBank);
applyStudentZeroP3P4(modules, practiceBank, primmBank, noviceBank);
applyStudentZeroP5P6(modules, practiceBank, primmBank, noviceBank);
applyStudentZeroP7P8(modules, practiceBank, primmBank, noviceBank);
applyStudentZeroP8P9(modules, practiceBank, primmBank, noviceBank);
applyStudentZeroP9T1(modules, practiceBank, primmBank, noviceBank);
applyStudentZeroT1T2(modules, practiceBank, primmBank, noviceBank);
applyStudentZeroT2T3(modules, practiceBank, primmBank, noviceBank);
applyStudentZeroT3T4(modules, practiceBank, primmBank, noviceBank);
applyStudentZeroT4T5(modules, practiceBank, primmBank, noviceBank);

// T3-X4 teste un code client contre une pile complète : l’exercice doit donc être autonome
// dans le Python Lab, sans dépendre d’un exercice exécuté auparavant.
const t3x4 = practiceBank.find(item => item.id === 'T3-X4');
if (t3x4) {
  const pileSupport = "class Pile:\n    def __init__(self):\n        self._data = []\n    def empiler(self, x):\n        self._data.append(x)\n    def depiler(self):\n        assert not self.est_vide()\n        return self._data.pop()\n    def est_vide(self):\n        return len(self._data) == 0";
  t3x4.starter = `${pileSupport}\n\ndef annuler(pile):\n    pass`;
  t3x4.solution = `${pileSupport}\n\ndef annuler(pile):\n    if pile.est_vide():\n        return None\n    return pile.depiler()`;
}

const noviceP9 = noviceBank.find(item => item.moduleId === 'P9');
if (noviceP9 && noviceP9.checks.length > 3) noviceP9.checks = noviceP9.checks.slice(0, 3);
export { practiceBank, primmBank, capstones, noviceBank };

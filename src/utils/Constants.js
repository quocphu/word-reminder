/**
 * Constant value
 * Created on: Sat Aug 20 2016
 * Author: phukq<quocphu.02@gmail.com>
 */
var CONS = {};
CONS.DB_NAME = 'WORD_REMINDER';
CONS.DB_TBL_BOOK = 'TBL_BOOK';
CONS.DB_TBL_LESSON = 'TBL_LESSON';

CONS.WORD_CLASS = [
  { 'name': 'nouns', 'shortName': 'n' },
  { 'name': 'verbs', 'shortName': 'v' },
  { 'name': 'adjectives', 'shortName': 'adj' },
  { 'name': 'adverbs ', 'shortName': 'adv' },
  { 'name': 'prepositions', 'shortName': 'prep' },
  { 'name': 'pronouns', 'shortName': 'pro' },
  { 'name': 'determiners', 'shortName': 'determiners' },
  { 'name': 'conjunctions', 'shortName': 'conjunctions' },
  { 'name': 'interjections', 'shortName': 'interjections' },
  { 'name': 'idioms', 'shortName': 'idiom' }
];

window.CONS = CONS;
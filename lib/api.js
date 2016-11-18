'use strict';
const alfy = require('alfy');

const BASE = 'https://angular.io/docs/ts/latest/api';
const TYPES = ['class', 'const', 'var', 'let', 'decorator', 'directive', 'enum', 'function', 'interface'];
const ONE_DAY = 86400000;

exports.search = () => alfy
	.fetch(`${BASE}/api-list.json`, {
		maxAge: ONE_DAY,
		transform: result => {
			const modules = Object.keys(result);
			let items = [];

			for (const module of modules) {
				items = items.concat(result[module]);
			}

			return items;
		}
	})
	.then(modules => {
		const items = modules.map(x => {
			const url = `${BASE}/${x.path}`;

			return {
				title: x.title,
				autocomplete: x.title,
				subtitle: `${x.barrel} - ${x.docType}`,
				arg: url,
				quicklookurl: url,
				icon: TYPES.indexOf(x.docType) !== -1 && {path: `./icons/${x.docType}.png`},
				mods: {
					alt: {
						subtitle: x.stability
					}
				}
			};
		});

		return alfy.inputMatches(items, 'title');
	});
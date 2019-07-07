import '../templates/treatmentRecap.html';

import { Template } from 'meteor/templating';
import { createTreatmentGrid } from '../../api/utilities.js';
import { Drugs } from '../../api/collections';

Template.treatmentRecap.helpers({
	openTreatments() {
		return getOpenTreatments();
	},
	synthesizedTreatmentGrid() {
		return createSynthesizedTreatmentGrid();
	}
});

function getOpenTreatments() {
	// return all drugs whose treatment grid contains at least one checked box
	return Drugs.find().fetch().filter(drug => {
		// check if at least one cell of the treatment grid is checked
		return drug.treatmentGrid.some(line => line.some(cell => cell.checked));
	});
}

function createSynthesizedTreatmentGrid() {
	const drugs = getOpenTreatments();
	let s = createTreatmentGrid();
	
	// format treatment grid
	s = s.map(l => l.map(e => {
		return {
			pos: e.pos,
			treatments: [],
		}
	}));

	// for each cell of the treatment grid of each drug
	drugs.forEach(drug => {
		drug.treatmentGrid.forEach((line, y) => {
			line.forEach((cell, x) => {
				if (cell.checked) {
					// add treatment to this cell
					s[y][x].treatments.push(drug._id);
				}
			});
		});
	});

	console.log(s);
}

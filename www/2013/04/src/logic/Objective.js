var Objective = (function(){

	function Objective(nbEnnemies, nbShrapnels, dialog, isBoss) {
		this.dialog = dialog;
		this.nbEnnemies = nbEnnemies;
		this.nbShrapnels = nbShrapnels;
		this.isBoss = isBoss;
		this.initialState = {
			nbEnnemies: nbEnnemies,
			nbShrapnels: nbEnnemies * nbShrapnels
		};
		this.objectives = {
			nbEnnemies: nbEnnemies,
			nbShrapnels: nbEnnemies * nbShrapnels
		};
		this.completedSignal = new signals.Signal();
	}

	Objective.prototype.setInitNbEnnemies = function(nb) {
		this.nbEnnemies = nb;
		this.initialState = {
			nbEnnemies: nb,
			nbShrapnels: nb * this.nbShrapnels
		};
		this.objectives = {
			nbEnnemies: nb,
			nbShrapnels: nb * this.nbShrapnels
		};
	};

	Objective.prototype.update = function() {
		this.objectives.nbEnnemies--;
		this.checkCompletion();
	};

	Objective.prototype.killShrapnel = function() {
		this.objectives.nbShrapnels--;
		this.checkCompletion();
	};

	Objective.prototype.checkCompletion = function() {
		if(this.objectives.nbEnnemies <= 0 && this.objectives.nbShrapnels <= 0) {
			this.completedSignal.dispatch();
		}
	}

	return Objective;
})();
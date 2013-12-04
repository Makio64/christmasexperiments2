var ObjectivesManager = (function(){

	function ObjectivesManager() {
		this.objectives = [];
		this.currentObjectiveIndex = -1;
	}

	ObjectivesManager.prototype.addObjective = function(nbKills, nbShrapnels, dialog, isBoss) {
		this.objectives.push(new Objective(nbKills, nbShrapnels, dialog, isBoss));
		if(this.objectives.length <= 1) {
			this.onCurrentObjectiveComplete();
		}
	};

	ObjectivesManager.prototype.updateCurrentObjective = function() {
		this.objectives[this.currentObjectiveIndex].update();
	};

	ObjectivesManager.prototype.killShrapnel = function() {
		if(!this.objectives[this.currentObjectiveIndex]) return;
		this.objectives[this.currentObjectiveIndex].killShrapnel();
	};

	ObjectivesManager.prototype.getCurrentObjective = function() {
		return this.objectives[this.currentObjectiveIndex];
	};

	ObjectivesManager.prototype.onCurrentObjectiveComplete = function() {
		this.currentObjectiveIndex++;
		if(this.currentObjectiveIndex < this.objectives.length) {
			this.objectives[this.currentObjectiveIndex].completedSignal.add(this.onCurrentObjectiveComplete.bind(this));
		}
	};

	return ObjectivesManager;
})();
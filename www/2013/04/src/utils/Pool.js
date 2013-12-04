/**
 * EntityClass must implement a kill method that puts its instance in a dead mode
 * and a spawn method that puts its instance in live method
*/
var Pool = (function(){

	/* ===================================================
		CONSTRUCTOR
	=================================================== */
	function Pool(entityClass, maxLivingEntity) {
		this.entityClass = entityClass;
		this.maxLivingEntity = maxLivingEntity || 100;

		this.livingEntities = [];
		this.deadEntities = [];
	}

	Pool.prototype.getEntity = function(params) {
		// if dead Entity available get one
		if(this.deadEntities.length > 0) {
			return this._resurrectEntity(params);
		}

		// if too much living entity already don't create one but recycle one of the living
		if(this.livingEntities.length >= this.maxLivingEntity) {
			return this._recycleEntity(params);
		}

		// else create a new one
		return this._createEntity(params);
	};

	Pool.prototype._createEntity = function(params) {
		var entity = new this.entityClass();
		this.livingEntities.push(entity);
		entity.spawn(params);
		return entity;
	};

	Pool.prototype._resurrectEntity = function(params) {
		var entity = this.deadEntities.shift();
		this.livingEntities.push(entity);
		entity.spawn(params);
		return entity;
	};

	Pool.prototype._recycleEntity = function(params) {
		var entity = this.livingEntities.shift();
		entity.kill();
		entity.spawn(params);
		this.livingEntities.push(entity);
		return entity;
	};

	Pool.prototype.killEntity = function(entity) {
		var index = this.livingEntities.indexOf(entity);
		if(index > -1) {
			this.livingEntities.splice(index, 1);
			entity.kill();
			this.deadEntities.push(entity);
		}
	};

	Pool.prototype.flush = function() {
		for (var i = this.livingEntities.length - 1; i >= 0; i--) {
			this.livingEntities[i].kill();
		}
		for (var i = this.deadEntities.length - 1; i >= 0; i--) {
			this.deadEntities[i].kill();
		}
		this.livingEntities = null;
		this.deadEntities = null;
	};

	Pool.prototype.callForLiving = function(funcName) {
		for (var i = this.livingEntities.length - 1; i >= 0; i--) {
			this.livingEntities[i][funcName]();
		}
	};

	Pool.prototype.each = function(func) {
		for (var i = this.livingEntities.length - 1; i >= 0; i--) {
			func(this.livingEntities[i]);
		}
	};

	return Pool;
})();
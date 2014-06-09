(function (root) {

	var prepare = function(Ember) {
		Ember.whenNotRunning = function(name, original) {
			if(typeof name === 'function') {
				original = name;
				name = null;
			}

			name = name || 'isRunning';

			return function() {
				var self = this;

				if(this.get(name)) {
					return false;
				}

				this.set(name, true);

				//prepare arguments
				var end = function() {
					self.set(name, false);
				};

				var args = Array.prototype.slice.call(arguments, 0);
				args.unshift(end);

				//call original fn
				var retVar = original.apply(this, args);

				if(typeof retVar !== 'undefined') {
					if(retVar.then) {
						retVar.then(end, end);
					} else {
						end();
					}
				}
			};
		};

		if (Ember.EXTEND_PROTOTYPES === true) {
			Function.prototype.whenNotRunning = function(name) {
				return Ember.whenNotRunning(name, this);
			};
		}
	};

	//AMD
	if (typeof define !== 'undefined' && define.amd) {
		define(['ember'], function(Ember) {
			return prepare(Ember);
		});
	}

	//CommonJS
	else if (typeof module !== 'undefined' && module.exports) {
		module.exports = prepare(require('ember'));
	}

	//Script tag
	else {
		prepare(root.Ember);
	}
	
} (this));
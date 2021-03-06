'use strict';

var _ = require('../');

var _constants = require('../constants');

var _helpers = require('../helpers');

var create = function create() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'app';
  return _.Machine.create(name, {
    state: { idle: { run: 'running' } },
    transitions: {}
  });
};

describe('Given the Stent library', function () {
  beforeEach(function () {
    _.Machine.flush();
  });
  describe('when creating a new machine', function () {
    it('should have the machine with its name set up', function () {
      expect(create('foo').name).to.equal('foo');
    });
  });
  describe('when `getting a machine', function () {
    it('should return the machine if it exists', function () {
      create('bar');

      expect(_.Machine.get('bar').name).to.equal('bar');
    });
    it('should throw an error if the machine does not exist', function () {
      create('bar');

      expect(_.Machine.get.bind(_.Machine, 'baz')).to.throw((0, _constants.ERROR_MISSING_MACHINE)('baz'));
    });
  });
  describe('when creating a machine without a name', function () {
    it('should be possible to fetch it by using the machine itself or the its generated name', function () {
      var machine = _.Machine.create({
        state: { name: 'idle' },
        transitions: { idle: { run: 'running' } }
      });

      expect(_.Machine.get(machine).state.name).to.equal('idle');
      expect(_.Machine.get(machine.name).state.name).to.equal('idle');
    });
  });
  describe('when we fire two actions one after each other', function () {
    describe('and we use the .latest version of the action', function () {
      it('should cancel the first action and only work with the second one', function (done) {
        var backend = sinon.stub();
        backend.withArgs('s').returns('salad');
        backend.withArgs('st').returns('stent');

        var api = function api(char) {
          return new Promise(function (resolve) {
            setTimeout(function () {
              return resolve(backend(char));
            }, 10);
          });
        };

        var machine = _.Machine.create({
          state: { name: 'x' },
          transitions: {
            x: {
              type: /*#__PURE__*/regeneratorRuntime.mark(function type(state, letter) {
                var match;
                return regeneratorRuntime.wrap(function type$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _helpers.call)(api, letter);

                      case 2:
                        match = _context.sent;
                        return _context.abrupt('return', { name: 'y', match: match });

                      case 4:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, type, this);
              })
            },
            y: {
              'noway': 'x'
            }
          }
        });

        machine.type.latest('s');
        machine.type.latest('st');

        setTimeout(function () {
          expect(machine.state).to.deep.equal({ name: 'y', match: 'stent' });
          done();
        }, 20);
      });
    });
  });
});
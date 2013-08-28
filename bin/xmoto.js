// Generated by CoffeeScript 1.6.3
(function() {
  window.Assets = (function() {
    function Assets() {
      this.queue = new createjs.LoadQueue();
      this.list = [];
      this.textures = [];
      this.anims = [];
    }

    Assets.prototype.load = function(items, callback) {
      var item, _i, _len;
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        this.list.push(item.id);
      }
      this.queue.addEventListener("complete", callback);
      return this.queue.loadManifest(items);
    };

    Assets.prototype.load_for_level = function(level, callback) {
      var block, entity, item, items, param, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      this.list.push(level.sky.name);
      this.textures.push(level.sky.name);
      this.list.push('dirt');
      this.textures.push('dirt');
      _ref = level.blocks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        block = _ref[_i];
        this.list.push(block.usetexture.id);
        this.textures.push(block.usetexture.id);
      }
      _ref1 = level.entities;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        entity = _ref1[_j];
        if (entity.type_id === 'Sprite') {
          _ref2 = entity.params;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            param = _ref2[_k];
            if (param.name === 'name') {
              this.list.push(param.value);
              this.anims.push(param.value);
            }
          }
        }
      }
      _ref3 = level.entities;
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        entity = _ref3[_l];
        if (entity.type_id === 'EndOfLevel') {
          this.list.push('checkball_00');
          this.anims.push('checkball_00');
        }
      }
      items = [];
      _ref4 = this.textures;
      for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
        item = _ref4[_m];
        items.push({
          id: item,
          src: "data/Textures/Textures/" + item + ".jpg"
        });
      }
      _ref5 = this.anims;
      for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
        item = _ref5[_n];
        items.push({
          id: item,
          src: "data/Textures/Anims/" + item + ".png"
        });
      }
      this.queue.addEventListener("complete", callback);
      return this.queue.loadManifest(items);
    };

    Assets.prototype.get = function(name) {
      return this.queue.getResult(name);
    };

    return Assets;

  })();

  window.Infos = (function() {
    function Infos() {}

    Infos.prototype.parse = function(xml) {
      var xml_border, xml_infos, xml_level, xml_music;
      xml_level = $(xml).find('level');
      this.identifier = xml_level.attr('id');
      this.pack_name = xml_level.attr('levelpack');
      this.pack_id = xml_level.attr('levelpackNum');
      this.r_version = xml_level.attr('rversion');
      xml_infos = $(xml).find('level').find('info');
      this.name = xml_infos.find('name').text();
      this.description = xml_infos.find('description').text();
      this.author = xml_infos.find('author').text();
      this.date = xml_infos.find('date').text();
      xml_border = xml_infos.find('border');
      this.border = xml_border.attr('texture');
      xml_music = xml_infos.find('music');
      return this.music = xml_music.attr('name');
    };

    Infos.prototype.display = function() {};

    return Infos;

  })();

  window.Level = (function() {
    function Level() {
      this.assets = new window.Assets();
      this.infos = new window.Infos();
      this.sky = new window.Sky(this, this.assets);
    }

    Level.prototype.load_from_file = function(file_name) {
      return $.ajax({
        type: "GET",
        url: "data/Levels/" + file_name,
        dataType: "xml",
        success: this.xml_parser,
        async: false,
        context: this
      });
    };

    Level.prototype.xml_parser = function(xml) {
      this.infos.parse(xml);
      this.sky.parse(xml);
      this.xml_parse_layer_offsets(xml);
      this.xml_parse_limits(xml);
      this.xml_parse_script(xml);
      this.xml_parse_blocks(xml);
      return this.xml_parse_entities(xml);
    };

    Level.prototype.xml_parse_layer_offsets = function(xml) {
      var layer_offset, xml_layer_offset, xml_layer_offsets, _i, _len, _results;
      xml_layer_offsets = $(xml).find('layeroffsets layeroffset');
      this.layer_offsets = [];
      _results = [];
      for (_i = 0, _len = xml_layer_offsets.length; _i < _len; _i++) {
        xml_layer_offset = xml_layer_offsets[_i];
        layer_offset = {
          x: parseFloat($(xml_layer_offset).attr('x')),
          y: parseFloat($(xml_layer_offset).attr('y')),
          front_layer: $(xml_layer_offset).attr('frontlayer')
        };
        _results.push(this.layer_offsets.push(layer_offset));
      }
      return _results;
    };

    Level.prototype.xml_parse_limits = function(xml) {
      var xml_limits;
      xml_limits = $(xml).find('limits');
      this.screen_limits = {
        left: parseFloat(xml_limits.attr('left')) * 1.15,
        right: parseFloat(xml_limits.attr('right')) * 1.15,
        top: parseFloat(xml_limits.attr('top')) * 1.15,
        bottom: parseFloat(xml_limits.attr('bottom')) * 1.15
      };
      this.player_limits = {
        left: parseFloat(xml_limits.attr('left')),
        right: parseFloat(xml_limits.attr('right')),
        top: parseFloat(xml_limits.attr('top')),
        bottom: parseFloat(xml_limits.attr('bottom'))
      };
      return this.size = {
        x: this.screen_limits.right - this.screen_limits.left,
        y: this.screen_limits.top - this.screen_limits.bottom
      };
    };

    Level.prototype.xml_parse_script = function(xml) {
      var xml_script;
      xml_script = $(xml).find('script');
      return this.script = xml_script.text();
    };

    Level.prototype.xml_parse_blocks = function(xml) {
      var block, material, vertex, xml_block, xml_blocks, xml_material, xml_materials, xml_vertex, xml_vertices, _i, _j, _k, _len, _len1, _len2, _results;
      xml_blocks = $(xml).find('block');
      this.blocks = [];
      _results = [];
      for (_i = 0, _len = xml_blocks.length; _i < _len; _i++) {
        xml_block = xml_blocks[_i];
        block = {
          id: $(xml_block).attr('id'),
          position: {
            x: parseFloat($(xml_block).find('position').attr('x')),
            y: parseFloat($(xml_block).find('position').attr('y')),
            dynamic: $(xml_block).find('position').attr('dynamic'),
            background: $(xml_block).find('position').attr('background')
          },
          usetexture: {
            id: $(xml_block).find('usetexture').attr('id').toLowerCase(),
            scale: parseFloat($(xml_block).find('usetexture').attr('scale'))
          },
          physics: {
            grip: parseFloat($(xml_block).find('physics').attr('grip'))
          },
          edges: {
            angle: parseFloat($(xml_block).find('edges').attr('angle')),
            materials: []
          },
          vertices: []
        };
        xml_materials = $(xml_block).find('edges material');
        for (_j = 0, _len1 = xml_materials.length; _j < _len1; _j++) {
          xml_material = xml_materials[_j];
          material = {
            name: $(xml_material).attr('name'),
            edge: $(xml_material).attr('edge'),
            color_r: parseInt($(xml_material).attr('color_r')),
            color_g: parseInt($(xml_material).attr('color_g')),
            color_b: parseInt($(xml_material).attr('color_b')),
            color_a: parseInt($(xml_material).attr('color_a')),
            scale: parseFloat($(xml_material).attr('scale')),
            depth: parseFloat($(xml_material).attr('depth'))
          };
          block.edges.materials.push(material);
        }
        xml_vertices = $(xml_block).find('vertex');
        for (_k = 0, _len2 = xml_vertices.length; _k < _len2; _k++) {
          xml_vertex = xml_vertices[_k];
          vertex = {
            x: parseFloat($(xml_vertex).attr('x')),
            y: parseFloat($(xml_vertex).attr('y')),
            edge: $(xml_vertex).attr('edge')
          };
          block.vertices.push(vertex);
        }
        _results.push(this.blocks.push(block));
      }
      return _results;
    };

    Level.prototype.xml_parse_entities = function(xml) {
      var entity, param, xml_entities, xml_entity, xml_param, xml_params, _i, _j, _len, _len1, _results;
      xml_entities = $(xml).find('entity');
      this.entities = [];
      _results = [];
      for (_i = 0, _len = xml_entities.length; _i < _len; _i++) {
        xml_entity = xml_entities[_i];
        entity = {
          id: $(xml_entity).attr('id'),
          type_id: $(xml_entity).attr('typeid'),
          size: {
            r: parseFloat($(xml_entity).find('size').attr('r')),
            width: parseFloat($(xml_entity).find('size').attr('width')),
            height: parseFloat($(xml_entity).find('size').attr('height'))
          },
          position: {
            x: parseFloat($(xml_entity).find('position').attr('x')),
            y: parseFloat($(xml_entity).find('position').attr('y')),
            angle: parseFloat($(xml_entity).find('position').attr('angle'))
          },
          params: []
        };
        xml_params = $(xml_entity).find('param');
        for (_j = 0, _len1 = xml_params.length; _j < _len1; _j++) {
          xml_param = xml_params[_j];
          param = {
            name: $(xml_param).attr('name'),
            value: $(xml_param).attr('value').toLowerCase()
          };
          entity.params.push(param);
        }
        _results.push(this.entities.push(entity));
      }
      return _results;
    };

    Level.prototype.load_assets = function(callback) {
      return this.assets.load_for_level(this, callback);
    };

    Level.prototype.draw = function() {
      var block, canvas, canvas_height, canvas_width, entity, i, image, param, scale, translate, vertex, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _results;
      canvas = $('#game').get(0);
      canvas_width = parseFloat(canvas.width);
      canvas_height = canvas.width * (this.size.y / this.size.x);
      $('#game').attr('height', canvas_height);
      this.ctx = canvas.getContext('2d');
      scale = {
        x: canvas_width / this.size.x,
        y: -canvas_height / this.size.y
      };
      translate = {
        x: -this.screen_limits.left,
        y: -this.screen_limits.top
      };
      this.ctx.scale(scale.x, scale.y);
      this.ctx.translate(translate.x, translate.y);
      this.ctx.lineWidth = 0.1;
      this.sky.display(this.ctx);
      this.ctx.beginPath();
      this.ctx.moveTo(this.screen_limits.left, this.screen_limits.top);
      this.ctx.lineTo(this.screen_limits.left, this.screen_limits.bottom);
      this.ctx.lineTo(this.player_limits.left, this.screen_limits.bottom);
      this.ctx.lineTo(this.player_limits.left, this.screen_limits.top);
      this.ctx.closePath();
      this.ctx.save();
      this.ctx.scale(1.0 / scale.x, 1.0 / scale.y);
      this.ctx.fillStyle = this.ctx.createPattern(this.assets.get('dirt'), "repeat");
      this.ctx.fill();
      this.ctx.restore();
      this.ctx.beginPath();
      this.ctx.moveTo(this.screen_limits.right, this.screen_limits.top);
      this.ctx.lineTo(this.screen_limits.right, this.screen_limits.bottom);
      this.ctx.lineTo(this.player_limits.right, this.screen_limits.bottom);
      this.ctx.lineTo(this.player_limits.right, this.screen_limits.top);
      this.ctx.closePath();
      this.ctx.save();
      this.ctx.scale(1.0 / scale.x, 1.0 / scale.y);
      this.ctx.fillStyle = this.ctx.createPattern(this.assets.get('dirt'), "repeat");
      this.ctx.fill();
      this.ctx.restore();
      this.ctx.beginPath();
      this.ctx.moveTo(this.player_limits.right, this.player_limits.bottom);
      this.ctx.lineTo(this.player_limits.left, this.player_limits.bottom);
      this.ctx.lineTo(this.player_limits.left, this.screen_limits.bottom);
      this.ctx.lineTo(this.player_limits.right, this.screen_limits.bottom);
      this.ctx.closePath();
      this.ctx.save();
      this.ctx.scale(1.0 / scale.x, 1.0 / scale.y);
      this.ctx.fillStyle = this.ctx.createPattern(this.assets.get('dirt'), "repeat");
      this.ctx.fill();
      this.ctx.restore();
      _ref = this.blocks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        block = _ref[_i];
        this.ctx.beginPath();
        _ref1 = block.vertices;
        for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
          vertex = _ref1[i];
          if (i === 0) {
            this.ctx.moveTo(block.position.x + vertex.x, block.position.y + vertex.y);
          } else {
            this.ctx.lineTo(block.position.x + vertex.x, block.position.y + vertex.y);
          }
        }
        this.ctx.closePath();
        this.ctx.save();
        this.ctx.scale(1.0 / scale.x, 1.0 / scale.y);
        this.ctx.fillStyle = this.ctx.createPattern(this.assets.get(block.usetexture.id), "repeat");
        this.ctx.fill();
        this.ctx.restore();
      }
      _ref2 = this.entities;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        entity = _ref2[_k];
        if (entity.type_id === 'Sprite') {
          _ref3 = entity.params;
          for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
            param = _ref3[_l];
            if (param.name === 'name') {
              image = param.value;
            }
          }
          this.ctx.save();
          this.ctx.translate(entity.position.x, entity.position.y);
          this.ctx.scale(1, -1);
          this.ctx.drawImage(this.assets.get(image), 0, 0, entity.size.r * 4, -entity.size.r * 4);
          this.ctx.restore();
        }
      }
      _ref4 = this.entities;
      _results = [];
      for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
        entity = _ref4[_m];
        if (entity.type_id === 'EndOfLevel') {
          this.ctx.save();
          this.ctx.translate(entity.position.x - entity.size.r, entity.position.y - entity.size.r);
          this.ctx.scale(1, -1);
          this.ctx.drawImage(this.assets.get('checkball_00'), 0, 0, entity.size.r * 2, -entity.size.r * 2);
          _results.push(this.ctx.restore());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Level.prototype.triangulate = function() {
      var block, set_of_triangles, triangle, triangulation, vertex, vertices, _i, _j, _len, _len1, _ref, _ref1, _results;
      this.triangles = [];
      _ref = this.blocks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        block = _ref[_i];
        vertices = [];
        _ref1 = block.vertices;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          vertex = _ref1[_j];
          vertices.push(new poly2tri.Point(block.position.x + vertex.x, block.position.y + vertex.y));
        }
        triangulation = new poly2tri.SweepContext(vertices, {
          cloneArrays: true
        });
        triangulation.triangulate();
        set_of_triangles = triangulation.getTriangles();
        _results.push((function() {
          var _k, _len2, _results1;
          _results1 = [];
          for (_k = 0, _len2 = set_of_triangles.length; _k < _len2; _k++) {
            triangle = set_of_triangles[_k];
            _results1.push(this.triangles.push([
              {
                x: triangle.points_[0].x,
                y: triangle.points_[0].y
              }, {
                x: triangle.points_[1].x,
                y: triangle.points_[1].y
              }, {
                x: triangle.points_[2].x,
                y: triangle.points_[2].y
              }
            ]));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    return Level;

  })();

  $(function() {
    var level;
    level = new window.Level();
    level.load_from_file('l1038.lvl');
    return level.load_assets(function() {
      var ball, physics, triangle, update, world, _i, _len, _ref;
      level.triangulate();
      level.draw();
      physics = new window.Physics(30);
      world = physics.createWorld(level.ctx);
      ball = physics.createBall(world, 1, 7, 1, false, 'ball' + i);
      _ref = level.triangles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        triangle = _ref[_i];
        physics.createTriangle(world, triangle, true, []);
      }
      update = function() {
        level.draw();
        world.Step(1 / 60, 10, 10);
        world.DrawDebugData();
        return world.ClearForces();
      };
      return window.setInterval(update, 1000 / 60);
    });
  });

  $(function() {
    var b2AABB, b2Body, b2BodyDef, b2CircleShape, b2DebugDraw, b2Fixture, b2FixtureDef, b2MassData, b2MouseJointDef, b2PolygonShape, b2Vec2, b2World;
    b2World = Box2D.Dynamics.b2World;
    b2Vec2 = Box2D.Common.Math.b2Vec2;
    b2AABB = Box2D.Collision.b2AABB;
    b2BodyDef = Box2D.Dynamics.b2BodyDef;
    b2Body = Box2D.Dynamics.b2Body;
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    b2Fixture = Box2D.Dynamics.b2Fixture;
    b2MassData = Box2D.Collision.Shapes.b2MassData;
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
    return window.Physics = (function() {
      function Physics(scale) {
        this.SCALE = scale;
      }

      Physics.prototype.createWorld = function(context) {
        var debugDraw, world;
        world = new b2World(new b2Vec2(0, -10), true);
        debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(context);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetDrawScale(this.SCALE);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
        return world;
      };

      Physics.prototype.createBody = function(type, world, x, y, dimensions, fixed, userData) {
        var bodyDef, fixDef;
        if (typeof fixed === 'undefined') {
          fixed = true;
        }
        fixDef = new b2FixtureDef();
        fixDef.userData = userData;
        switch (type) {
          case 'box':
            fixDef.shape = new b2PolygonShape();
            fixDef.shape.SetAsBox(dimensions.width / this.SCALE, dimensions.height / this.SCALE);
            break;
          case 'ball':
            fixDef.shape = new b2CircleShape(dimensions.radius / this.SCALE);
        }
        bodyDef = new b2BodyDef();
        bodyDef.position.x = x / this.SCALE;
        bodyDef.position.y = y / this.SCALE;
        if (fixed) {
          bodyDef.type = b2Body.b2_staticBody;
        } else {
          bodyDef.type = b2Body.b2_dynamicBody;
          fixDef.density = 1.0;
          fixDef.restitution = 0.5;
        }
        return world.CreateBody(bodyDef).CreateFixture(fixDef);
      };

      Physics.prototype.createBox = function(world, x, y, width, height, fixed, userData) {
        var dimensions;
        dimensions = {
          width: width,
          height: height
        };
        return this.createBody('box', world, x, y, dimensions, fixed, userData);
      };

      Physics.prototype.createBall = function(world, x, y, radius, fixed, userData) {
        var dimensions;
        dimensions = {
          radius: radius
        };
        return this.createBody('ball', world, x, y, dimensions, fixed, userData);
      };

      Physics.prototype.createTriangle = function(world, vertices, fixed, userData) {
        var bodyDef, fixDef;
        if (typeof fixed === 'undefined') {
          fixed = true;
        }
        fixDef = new b2FixtureDef();
        fixDef.userData = userData;
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsArray([new b2Vec2(vertices[0].x / this.SCALE, vertices[0].y / this.SCALE), new b2Vec2(vertices[1].x / this.SCALE, vertices[1].y / this.SCALE), new b2Vec2(vertices[2].x / this.SCALE, vertices[2].y / this.SCALE)]);
        bodyDef = new b2BodyDef();
        bodyDef.position.x = 0;
        bodyDef.position.y = 0;
        if (fixed) {
          bodyDef.type = b2Body.b2_staticBody;
        } else {
          bodyDef.type = b2Body.b2_dynamicBody;
          fixDef.density = 1.0;
          fixDef.restitution = 0.5;
        }
        return world.CreateBody(bodyDef).CreateFixture(fixDef);
      };

      return Physics;

    })();
  });

  window.Sky = (function() {
    function Sky(level) {
      this.level = level;
      this.assets = level.assets;
    }

    Sky.prototype.parse = function(xml) {
      var xml_sky;
      xml_sky = $(xml).find('level info sky');
      this.name = xml_sky.text().toLowerCase();
      this.color_r = parseInt(xml_sky.attr('color_r'));
      this.color_g = parseInt(xml_sky.attr('color_g'));
      this.color_b = parseInt(xml_sky.attr('color_b'));
      this.color_a = parseInt(xml_sky.attr('color_a'));
      this.zoom = parseFloat(xml_sky.attr('zoom'));
      return this.offset = parseFloat(xml_sky.attr('offset'));
    };

    Sky.prototype.display = function(ctx) {
      return ctx.drawImage(this.assets.get(this.name), this.level.screen_limits.left, this.level.screen_limits.bottom, this.level.size.x, this.level.size.y);
    };

    return Sky;

  })();

}).call(this);

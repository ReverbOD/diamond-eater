// Initialize the Phaser Game object and set default game window size
const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
  })


  // variabiles
  let score = 0
  let scoreText
  let platforms
  let diamonds
  let cursors
  let player
  
  function preload () {
    // Load game assets
    game.load.image('sky', 'assets/sky.png')
    game.load.image('ground', './assets/platform.png')
    game.load.image('diamond', './assets/diamond.png')
    game.load.spritesheet('woof', './assets/woof.png', 32, 32)
  }
  
  function create () {
    //  Enable Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE)
  
    // Background
    game.add.sprite(0, 0, 'sky')
  
    //  Platform
    platforms = game.add.group()
  
    //  Enable Physics
    platforms.enableBody = true
  
    // Ground
    const ground = platforms.create(0, game.world.height - 64, 'ground')
  
    //  Scale Width 
    ground.scale.setTo(2, 2)
  
    //  Stop falling away when you jump on it
    ground.body.immovable = true
  
    // ledges
    let ledge = platforms.create(400, 450, 'ground')
    ledge.body.immovable = true
  
    ledge = platforms.create(-75, 350, 'ground')
    ledge.body.immovable = true
  
    // Players Setting
    player = game.add.sprite(32, game.world.height - 150, 'woof')
  
    //  Player's physics
    game.physics.arcade.enable(player)
  
    //  Player's physics properties.
    player.body.bounce.y = 0.2
    player.body.gravity.y = 800
    player.body.collideWorldBounds = true
  
    // 2D Movement.
    player.animations.add('left', [0, 1], 10, true)
    player.animations.add('right', [2, 3], 10, true)
  
    //  Add diamond
    diamonds = game.add.group()
  
    //  Diamonds physics
    diamonds.enableBody = true
  
    //  Create 12 diamonds evenly spaced apart
    for (var i = 0; i < 12; i++) {
      const diamond = diamonds.create(i * 70, 0, 'diamond')
  
      //  Drop em from the sky and bounce a bit
      diamond.body.gravity.y = 1000
      diamond.body.bounce.y = 0.3 + Math.random() * 0.2
    }
  
    //  Create the score text
    scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' })
  
    //  Controls
    cursors = game.input.keyboard.createCursorKeys()
  }
  
  function update () {
    // Stop pg when not moving
    player.body.velocity.x = 0
  
    //  Setup physics collision
    game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(diamonds, platforms)
  
    //  Callback callectionDiamond() if player overlaps with a diamond
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)
  
    // Control Config
    if (cursors.left.isDown) {
      player.body.velocity.x = -150
      player.animations.play('left')
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150
      player.animations.play('right')
    } else {
      // If no movement keys are pressed, stop the player
      player.animations.stop()
    }
  
    // Jump
    if (cursors.up.isDown && player.body.touching.down) {
      player.body.velocity.y = -400
    }
    // Show an alert modal when score reaches 120
    if (score === 120) {
      alert('You win!')
      score = 0
    }
  }
  
  function collectDiamond (player, diamond) {
    // Removes the diamond from the screen
    diamond.kill()
  
    //  And update the score
    score += 10
    scoreText.text = 'Score: ' + score
  }
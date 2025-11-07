tsParticles.load("particles-js", {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: '#62FFBB'
    },
    shape: {
      type: 'circle'
    },
    opacity: {
      value: 0.7,
      random: true
    },
    size: {
      value: 4,
      random: true
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'none',
      out_mode: 'bounce'
    },
    shadow: {
      enable: true,
      color: {
        value: '#62FFBB'
      },
      offset: {
        x: 0,
        y: 0
      },
      blur: 20
    }
  },
  interactivity: {
    events: {
      onhover: {
        enable: false,
        mode: 'repulse'
      },
      onclick: {
        enable: true,
        mode: 'push'
      }
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      }
    }
  },
  retina_detect: true
})
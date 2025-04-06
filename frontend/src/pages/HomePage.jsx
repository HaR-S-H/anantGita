import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, BookOpenIcon, MusicIcon, Users2Icon, PlayCircle } from "lucide-react"
import { motion } from "framer-motion"
import audio from "@/assets/audio/hare-rama.mp3";
import image from "@/assets/images/krishna-home.jpg";
import { Link, useNavigate } from "react-router-dom"
import chapter3Image from "@/assets/images/chapter3.jpg"
import chapter2Image from "@/assets/images/chapter2.jpg";
import chapter4Image from "@/assets/images/chapter4.jpg";
// Colors from your provided palette
import colors from "@/constants/colors"

const Homepage = () => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [showParticles, setShowParticles] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => console.log("Autoplay failed:", error))
    }

    // Initialize particles after a short delay for a dramatic entrance
    const timer = setTimeout(() => {
      setShowParticles(true)
    }, 1000)

    // Handle scroll for parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5 } },
  }

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
    },
  }

  return (
    <div style={{ backgroundColor: colors.paleBeige }} className="min-h-screen relative overflow-hidden">
      {/* Spiritual Particles Background */}
      {showParticles && <SpiritualParticles />}

      {/* Lotus Flower Animation */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 3 }}
      >
        <LotusBackground />
      </motion.div>

      {/* Audio Player */}
      <audio ref={audioRef} src={audio} preload="auto" loop />

      {/* Transparent Play/Pause Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Button
          onClick={toggleAudio}
          className="absolute top-4 right-4 bg-transparent border border-gray-300 p-2 rounded-full shadow-md hover:bg-gray-100 z-50"
        >
          {isPlaying ? <Pause className="h-5 w-5 text-gray-700" /> : <Play className="h-5 w-5 text-gray-700" />}
        </Button>
      </motion.div>

      {/* Hero Section */}
      <section style={{ backgroundColor: `${colors.warmBeige}99` }} className="py-16 md:py-17 relative">
        <motion.div
          className="absolute top-0 right-0 w-full h-full"
          style={{
            backgroundImage: "url(/images/mandala-pattern.svg)",
            backgroundSize: "600px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right -100px top -100px",
            opacity: 0.25,
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              className="md:w-1/2 mb-8 md:mb-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4 italianno-regular"
                style={{ color: colors.deeperRed }}
                variants={slideUp}
              >
                Begin Your Spiritual Journey
              </motion.h2>
              <motion.p className="text-lg mb-6 montserrat" style={{color:colors.darkRed}} variants={slideUp}>
              Dive into the eternal wisdom of the Bhagavad Gita with immersive lessons, thoughtful guidance, and a community of fellow seekers.
              </motion.p>
              <motion.div className="flex flex-wrap gap-4" variants={staggerChildren}>
                <motion.div variants={slideUp}>
                  <Button
                    size="lg"
                    style={{ backgroundColor: colors.primaryRed }}
                    className="hover:bg-red-600 relative overflow-hidden group"
                  >
                    <span className="relative z-10" onClick={()=>navigate('/study/chapter/1/verse/1')}>Start Learning</span>
                    <motion.span
                      className="absolute inset-0 bg-red-700 opacity-0 group-hover:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </Button>
                </motion.div>
                <motion.div variants={slideUp}>
                  <Button
                    size="lg"
                    variant="outline"
                    style={{ borderColor: colors.primaryRed, color: colors.primaryRed }}
                    onClick={()=>navigate('/study/chapter/1/verse/1')}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" /> Watch Introduction
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, type: "spring" }}
              viewport={{ once: true }}
            >
              <div className="relative w-full max-w-md">
                <motion.div
                  className="absolute -top-4 -right-4 w-64 h-64 md:w-80 md:h-80 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${colors.lightBeige} 0%, transparent 70%)`,
                  }}
                  animate={pulseAnimation}
                />
                <motion.div
                  className="relative z-10 rounded-full shadow-xl w-64 h-64 md:w-90 md:h-90 ml-7 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.img
                    src={image}
                    alt="Krishna and Arjuna"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-radial from-transparent to-amber-500/30"
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ backgroundColor: colors.offWhite }} className="py-16 relative">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: "url(/images/om-pattern.svg)",
            backgroundSize: "200px",
            backgroundRepeat: "repeat",
            opacity: 0.1,
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 montserrat"
            style={{ color: colors.darkRed }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Your Path to Understanding the Gita
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              {
                icon: <BookOpenIcon className="h-10 w-10" style={{ color: colors.primaryRed }} />,
                title: "Interactive Chapters",
                description: "Study all 18 chapters with verse-by-verse translations and explanations.",
              },
              {
                icon: <MusicIcon className="h-10 w-10" style={{ color: colors.primaryRed }} />,
                title: "Sanskrit Audio",
                description: "Listen to authentic pronunciations and musical renditions of verses.",
              },
              {
                icon: <Users2Icon className="h-10 w-10" style={{ color: colors.primaryRed }} />,
                title: "Community Forums",
                description: "Discuss meanings, ask questions, and share insights with fellow learners.",
              },
              {
                icon: <CalendarIcon className="h-10 w-10" style={{ color: colors.primaryRed }} />,
                title: "Daily Practice",
                description: "Receive daily verses and reflections to integrate teachings into daily life.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: index * 0.2 },
                  },
                }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-md h-full relative overflow-hidden">
                  <motion.div
                    className="absolute -right-10 -top-10 w-40 h-40 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${colors.lightBeige} 0%, transparent 70%)`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      delay: index * 0.5,
                    }}
                  />
                  <CardHeader>
                    <motion.div whileHover={{ rotate: 5, scale: 1.1 }} transition={{ duration: 0.3 }}>
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section style={{ backgroundColor: colors.lightBeige }} className="py-16 relative">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: "url(/images/lotus-pattern.svg)",
            backgroundSize: "300px",
            backgroundRepeat: "repeat",
            opacity: 0.15,
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 montserrat"
            style={{ color: colors.darkRed }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Featured Content
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              {
                image: chapter2Image,
                title: "The Essence of the Gita",
                subtitle: "Chapter 2 Overview",
                description: "Discover Sankhya Yoga where Krishna reveals the eternal soul, inner wisdom, and true detachment in life.",
                buttonText: "Read Now",
                link:"/study/chapter/2/verse/1"
              },
                          
              {
                image: chapter3Image,
                title: "Karma Yoga Explained",
                subtitle: "Chapter 3 Overview",
                description: "Explore Karma Yoga and learn how performing selfless duties leads to spiritual growth and inner harmony.",
                buttonText: "Read Now",
                 link:"/study/chapter/3/verse/1"
              },
              {
                image: chapter4Image,
                title: "Path of Divine Knowledge",
                subtitle: "Chapter 4 Overview",
                description: "Uncover Jnana Yoga, where Krishna shares divine knowledge and the value of action rooted in wisdom.",
                buttonText: "Read Now",
                link:"/study/chapter/4/verse/1"
              }
            ].map((content, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: index * 0.2 },
                  },
                }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-md h-full relative overflow-hidden pt-0">
                  <motion.div
                    className="relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={content.image}
                      alt={content.title}
                      className="w-full h-48 object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  <CardHeader>
                    <CardTitle style={{ color: colors.darkRed }}>{content.title}</CardTitle>
                    <CardDescription>{content.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{content.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      style={{ backgroundColor: colors.softRed }}
                      className="w-full relative overflow-hidden group"
                    >
                      <span className="relative z-10" onClick={()=>navigate(content.link)}>{content.buttonText}</span>
                      <motion.span
                        className="absolute inset-0 bg-red-700 opacity-0 group-hover:opacity-100"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.4 }}
                      />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: colors.deeperRed }} className="py-12 text-white relative">
        <motion.div
          className="absolute top-0 left-0 w-full h-20"
          style={{
            backgroundImage: `url(/images/border-pattern.svg)`,
            backgroundSize: "auto 100%",
            backgroundRepeat: "repeat-x",
            opacity: 0.2,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={slideUp}>
              <h3 className="text-xl font-bold mb-4">अनंत गीता | Anant Gita</h3>
              <p className="text-sm opacity-80">
                Your trusted companion on the path of spiritual wisdom and self-discovery.
              </p>
            </motion.div>
            <motion.div variants={slideUp}>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Home
                  </a>
                </li>
                <li>
                <Link to="/study/chapter/1/verse/1" className="opacity-80 hover:opacity-100 transition-opacity">
  All Chapters
</Link>
                </li>
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Study Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Community
                  </a>
                </li>
              </ul>
            </motion.div>
            <motion.div variants={slideUp}>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Sanskrit Dictionary
                  </a>
                </li>
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Audio Library
                  </a>
                </li>
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Expert Commentary
                  </a>
                </li>
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Daily Practice
                  </a>
                </li>
              </ul>
            </motion.div>
            <motion.div variants={slideUp}>
              <h4 className="font-bold mb-4">Connect With Us</h4>
              <p className="mb-4 text-sm opacity-80">Subscribe to receive daily verses and updates</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2  rounded-l outline-none w-full text-white"
                />
                <Button className="rounded-l-none" style={{ backgroundColor: colors.primaryRed }}>
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="border-t border-red-800 pt-8 text-center text-sm opacity-80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p>© 2025 Gita Gyan. All rights reserved. Dedicated to spiritual seekers worldwide.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

// Spiritual Particles Component
const SpiritualParticles = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const symbols = ["ॐ", "☸", "☯", "✡", "☮", "卍", "卐", "࿕", "࿖", "࿗", "࿘"]

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 7 + 3
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)]
        this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, 
                           ${Math.floor(Math.random() * 50)}, 
                           ${Math.floor(Math.random() * 50)}, 
                           ${Math.random() * 0.5 + 0.3})`
        this.rotation = 0
        this.rotationSpeed = Math.random() * 0.02 - 0.01
        this.oscillationAmplitude = Math.random() * 2
        this.oscillationSpeed = Math.random() * 0.02 + 0.01
        this.initialY = this.y
        this.time = Math.random() * 100
      }

      update() {
        this.x += this.speedX
        this.time += this.oscillationSpeed
        this.y = this.initialY + Math.sin(this.time) * this.oscillationAmplitude
        this.rotation += this.rotationSpeed

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.font = `${this.size * 5}px Arial`
        ctx.fillStyle = this.color
        ctx.fillText(this.symbol, 0, 0)
        ctx.restore()
      }
    }

    function init() {
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle())
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }
      requestAnimationFrame(animate)
    }

    init()
    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}

// Lotus Background Animation
const LotusBackground = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(400, 400)">
        {/* Lotus Petals */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const delay = i * 0.1

          return (
            <motion.path
              key={i}
              d="M0,-200 C50,-150 50,-50 0,0 C-50,-50 -50,-150 0,-200"
              fill="none"
              stroke={colors.primaryRed}
              strokeWidth="2"
              strokeOpacity="0.3"
              transform={`rotate(${i * 30})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: 0.3,
                scale: [1, 1.02, 1],
              }}
              transition={{
                pathLength: { delay, duration: 2, ease: "easeInOut" },
                opacity: { delay, duration: 2 },
                scale: {
                  delay: delay + 2,
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                },
              }}
            />
          )
        })}

        {/* Center Circle */}
        <motion.circle
          cx="0"
          cy="0"
          r="30"
          fill={colors.primaryRed}
          fillOpacity="0.2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, duration: 1.5 }}
        />

        {/* Om Symbol */}
        <motion.text
          x="0"
          y="10"
          fontSize="40"
          textAnchor="middle"
          fill={colors.deeperRed}
          fillOpacity="0.5"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.5,
            scale: [1, 1.1, 1],
          }}
          transition={{
            opacity: { delay: 2, duration: 1 },
            scale: {
              delay: 3,
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          }}
        >
          ॐ
        </motion.text>
      </g>
    </svg>
  )
}

export default Homepage


export default function ws() {
  switch (window.innerWidth) {
    case window.innerWidth < 600:
      return 'sm'
    case window.innerWidth < 320:
      return 'xsm'
    case window.innerWidth >= 600 && window.innerWidth < 980:
      return 'laptop'
    case window.innerWidth > 1920:
      return 'xl'
    default:
      return 'md'
  }
}
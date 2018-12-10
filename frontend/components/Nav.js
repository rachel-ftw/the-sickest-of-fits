import Link from 'next/link'

const Nav = () => (
  <div>
    <Link href="/">
      <a>home</a>
    </Link>
    <Link href='/sell'>
      <a>Sell</a>
    </Link>
  </div>
)


export default Nav
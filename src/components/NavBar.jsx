import { Fragment, useContext } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { parseCookies } from 'nookies'
import { AuthContext } from '../contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'

const navigation =
  [
    {  name: 'Dashboard', path: '/dashboard' },
    {  name: 'Users', path: '/users' },
  ]
const profile =
  [
    {  name: 'Update Profile', path: '/profile' },
  ]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar() {

  const { user, signOut } = useContext(AuthContext)
  const router = useRouter();

  function handleSignOut() {
    try {
      signOut();
    } catch (err) {
      alert('Error signing out');
    }
  }

  return (
    <Disclosure as="nav" className="bg-white-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-auto"
                      src="https://articulate.com/packs/images/logos/logo-9c72d20db654121da524f52cd0542b36.svg"
                      alt="Articulate"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item, itemIdx) =>
                        router.pathname === item.path ? (
                          <Fragment key={itemIdx}>
                            <Link
                              href={item.path}
                            >
                              <a className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                                {item.name}
                              </a>
                            </Link>
                          </Fragment>
                        ) : (
                          <Fragment key={itemIdx}>
                            <Link
                              href={item.path}
                            >
                              <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                                {item.name}
                              </a>
                            </Link>
                          </Fragment>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className="max-w-xs bg-white-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                              <span className="sr-only">Open user menu</span>
                              {open ? (
                                <XIcon className="block h-8 w-8" aria-hidden="true" />
                              ) : (
                                <MenuIcon className="block h-8 w-8" aria-hidden="true" />
                              )}
                            </Menu.Button>
                          </div>
                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              static
                              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              {profile.map((item, itemIdx) => (
                                <Menu.Item key={itemIdx}>
                                  {({ active }) => (
                                    <Link
                                      href={item.path}
                                    >
                                    <a
                                      className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm text-gray-700'
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                              <Menu.Item>
                                <a
                                  onClick={handleSignOut}
                                  href="#"
                                  className='block px-4 py-2 text-sm text-gray-700'
                                >
                                  Sign out
                                </a>
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item, itemIdx) =>
                  router.pathname === item.path ? (
                    <Fragment key={itemIdx}>
                      <Link
                        href={item.path}
                      >
                        <a className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">
                          {item.name}
                        </a>
                      </Link>
                    </Fragment>
                  ) : (
                    <Fragment key={itemIdx}>
                      <Link
                       href={item.path}
                      >
                        <a
                          className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        >
                          {item.name}
                        </a>
                      </Link>
                    </Fragment>
                  )
                )}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{user?.firstName} {user?.lastName}</div>
                    <div className="text-sm font-medium leading-none text-gray-400">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  {profile.map((item, itemIdx) => (
                    <Link
                      href={item.path}
                      key={itemIdx}
                    >
                    <a
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      {item.name}
                    </a>
                    </Link>
                  ))}
                  <a
                    onClick={handleSignOut}
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
  );
}

export const getServerSideProps = async (ctx) => {
  const { ['nextauth.token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
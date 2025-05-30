import { type ReactNode, useState } from 'react'

import { cn } from '@renderer/utils'

interface Props {
  children: ReactNode
}

const { window: win } = window.api

const windowButtons = [
  {
    name: 'minimize',
    action: () => win.minimize()
  },
  {
    name: 'maximize',
    action: () => win.maximize()
  },
  {
    name: 'close',
    action: () => win.close()
  }
]

export function WindowBorder({ children }: Props) {
  const [showTitleBar, setShowTitleBar] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  function toggleSidebar() {
    setShowSidebar((prev) => !prev)
  }

  return (
    <div className="w-screen h-screen grid grid-cols-[auto_1fr]">
      <aside
        className={cn('w-60 bg-zinc-900', {
          'w-0': !showSidebar
        })}
      >
        <div
          className={cn(
            'h-[1rem] absolute top-0 left-0 w-full bg-transparent flex justify-between items-center px-4',
            {
              'h-8': showTitleBar
            }
          )}
          onMouseEnter={() => setShowTitleBar(true)}
          onMouseLeave={() => setShowTitleBar(false)}
        ></div>
      </aside>
      <main
        className={cn('bg-zinc-900 w-full h-screen relative p-[0.4rem] @container', {
          'pt-8': showTitleBar
        })}
      >
        {/* <div
          className="cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setShowTitleBar(true)}
          onMouseLeave={() => setShowTitleBar(false)}
        >
          {' '}
          <div
            className={cn(
              'h-[1rem] absolute top-0 left-1/2 -translate-x-1/2 w-1/2 bg-red-400 [-webkit-app-region:drag]',
              {
                'h-8': showTitleBar
              }
            )}
          />
        </div> */}

        <header
          onMouseEnter={() => setShowTitleBar(true)}
          onMouseLeave={() => setShowTitleBar(false)}
          className={cn(
            'h-[1rem] absolute top-0 left-0 w-full bg-transparent flex justify-between items-center px-4 --[-webkit-app-region:no-drag]',
            {
              'h-8': showTitleBar
            }
          )}
        >
          {showTitleBar && (
            <>
              <button
                className="rounded-md p-1 hover:bg-zinc-800 [-webkit-app-region:no-drag]"
                onClick={toggleSidebar}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-4 fill-zinc-700"
                  xmlns="http://www.w3.org/2000/svg"
                  transform="rotate(180)"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.94358 2.25C8.10583 2.24998 6.65019 2.24997 5.51098 2.40314C4.33856 2.56076 3.38961 2.89288 2.64124 3.64124C1.89288 4.38961 1.56076 5.33856 1.40314 6.51098C1.24997 7.65019 1.24998 9.10582 1.25 10.9436V13.0564C1.24998 14.8942 1.24997 16.3498 1.40314 17.489C1.56076 18.6614 1.89288 19.6104 2.64124 20.3588C3.38961 21.1071 4.33856 21.4392 5.51098 21.5969C6.65018 21.75 8.1058 21.75 9.94354 21.75H14.0564C14.3706 21.75 14.6738 21.75 14.966 21.7492C14.9773 21.7497 14.9886 21.75 15 21.75C15.0129 21.75 15.0257 21.7497 15.0384 21.749C16.4224 21.7448 17.5607 21.7217 18.489 21.5969C19.6614 21.4392 20.6104 21.1071 21.3588 20.3588C22.1071 19.6104 22.4392 18.6614 22.5969 17.489C22.75 16.3498 22.75 14.8942 22.75 13.0565V10.9436C22.75 9.10585 22.75 7.65018 22.5969 6.51098C22.4392 5.33856 22.1071 4.38961 21.3588 3.64124C20.6104 2.89288 19.6614 2.56076 18.489 2.40314C17.5607 2.27833 16.4224 2.25523 15.0384 2.25096C15.0257 2.25032 15.0129 2.25 15 2.25C14.9886 2.25 14.9773 2.25025 14.966 2.25076C14.6737 2.25 14.3707 2.25 14.0564 2.25H9.94358ZM14.25 3.75002C14.1677 3.75 14.0844 3.75 14 3.75H10C8.09318 3.75 6.73851 3.75159 5.71085 3.88976C4.70476 4.02503 4.12511 4.27869 3.7019 4.7019C3.27869 5.12511 3.02503 5.70476 2.88976 6.71085C2.75159 7.73851 2.75 9.09318 2.75 11V13C2.75 14.9068 2.75159 16.2615 2.88976 17.2892C3.02503 18.2952 3.27869 18.8749 3.7019 19.2981C4.12511 19.7213 4.70476 19.975 5.71085 20.1102C6.73851 20.2484 8.09318 20.25 10 20.25H14C14.0844 20.25 14.1677 20.25 14.25 20.25L14.25 3.75002ZM15.75 20.2443C16.7836 20.2334 17.6082 20.2018 18.2892 20.1102C19.2952 19.975 19.8749 19.7213 20.2981 19.2981C20.7213 18.8749 20.975 18.2952 21.1102 17.2892C21.2484 16.2615 21.25 14.9068 21.25 13V11C21.25 9.09318 21.2484 7.73851 21.1102 6.71085C20.975 5.70476 20.7213 5.12511 20.2981 4.7019C19.8749 4.27869 19.2952 4.02503 18.2892 3.88976C17.6082 3.79821 16.7836 3.76662 15.75 3.75573L15.75 20.2443Z"
                    ></path>{' '}
                  </g>
                </svg>
              </button>

              {/* <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-72 bg-red-500 [-webkit-app-region:drag]"
                style={{
                  height: showTitleBar ? '2rem' : `${borderPaddingInRem}rem`
                }}
              /> */}

              <ul className="flex gap-1.5 [-webkit-app-region:no-drag]">
                {windowButtons.map(({ name, action }) => {
                  return (
                    <li
                      key={name}
                      onClick={action}
                      className={cn(`rounded-full size-4 bg-zinc-800`, {
                        'hover:bg-red-500': name == 'close',
                        'hover:bg-yellow-500': name == 'maximize',
                        'hover:bg-green-500': name == 'minimize'
                      })}
                    />
                  )
                })}
              </ul>
            </>
          )}
        </header>
        <div className="bg-zinc-950 rounded-md w-full h-full">{children}</div>
      </main>
    </div>
  )
}

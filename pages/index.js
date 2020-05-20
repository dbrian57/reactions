import Head from 'next/head'

export async function getStaticProps() {
  // {
  //   "data": {
  //     "repository": {
  //       "issue": {
  //         "reactionGroups": [
  //           { "content": "THUMBS_UP", "users": { "totalCount": 0 } },
  //           { "content": "THUMBS_DOWN", "users": { "totalCount": 0 } },
  //           { "content": "LAUGH", "users": { "totalCount": 0 } },
  //           { "content": "HOORAY", "users": { "totalCount": 0 } },
  //           { "content": "CONFUSED", "users": { "totalCount": 0 } },
  //           { "content": "HEART", "users": { "totalCount": 0 } },
  //           { "content": "ROCKET", "users": { "totalCount": 0 } },
  //           { "content": "EYES", "users": { "totalCount": 0 } }
  //         ]
  //       }
  //     }
  //   }
  // }
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`
    },
    body: JSON.stringify({
      query: `query {
        repository(owner:"chibicode", name:"reactions") {
          issue(number:1) {
            reactionGroups {
              content
              users(first: 0) {
                totalCount
              }
            }
          }
        }
      }`
    })
  })

  const json = await res.json()
  if (res.status !== 200) {
    console.error(json)
    throw new Error('Failed to fetch API')
  }

  // [0, 0, 0, 0, 0, 0, 0, 0]
  const reactions = json.data.repository.issue.reactionGroups.map(
    (item) => item.users.totalCount
  )

  return {
    props: {
      reactions
    },
    unstable_revalidate: 1
  }
}

export default function Home({ reactions }) {
  return (
    <div className='container'>
      <Head>
        <title>Static Reactions Demo</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta property='og:title' content='Static Reactions Demo' />
        <meta
          property='og:description'
          content='Using Next.js Incremental Static Regeneration'
        />
        <meta
          property='og:image'
          content='https://og-image.now.sh/Incremental%20Static%20Regeneration%20Demo%20using%20**GitHub%20Reactions**.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg'
        />
      </Head>

      <main>
        <h2>Static Reactions Demo</h2>
        <h3>
          Reactions on{' '}
          <a href='https://github.com/chibicode/reactions/issues/1'>
            this GitHub issue
          </a>
          :
        </h3>
        <div className='line'>
          <span className='emoji'>👍</span> <strong>{reactions[0]}</strong>
        </div>
        <div className='line'>
          <span className='emoji'>👎</span> <strong>{reactions[1]}</strong>
        </div>
        <div className='line'>
          <span className='emoji'>😄</span> <strong>{reactions[2]}</strong>
        </div>
        <div className='line'>
          <span className='emoji'>🎉</span> <strong>{reactions[3]}</strong>
        </div>
        <div className='line'>
          <span className='emoji'>😕</span> <strong>{reactions[4]}</strong>
        </div>
        <div className='line'>
          <span className='emoji'>🧡</span> <strong>{reactions[5]}</strong>
        </div>
        <div className='line'>
          <span className='emoji'>🚀</span> <strong>{reactions[6]}</strong>
        </div>
        <div className='line'>
          <span className='emoji'>👀</span> <strong>{reactions[7]}</strong>
        </div>
        <br />
        <div>
          <strong>Explanation:</strong> This page is statically generated with
          <a href="https://nextjs.org/">Next.js</a> by fetching data from GitHub. It’s deployed to{' '}
          <a href='https://vercel.com/edge-network'>Vercel’s Edge Network</a>{' '}
          (CDN). Importantly, this page is being regenerated using{' '}
          <a href='https://github.com/zeit/next.js/discussions/11552'>
            Incremental Static Regeneration
          </a>
          . Here’s how it works:
        </div>
        <ol>
          <li>
            Each page in a Next.js defines the timeout, in this case 1 second.
          </li>
          <li>
            When a new request comes in, the statically generated page is
            served.
          </li>
          <li>
            When a new request comes in, and the defined timeout is exceeded:
            (1) The statically generated page is served, and (2){' '}
            <strong>
              Next.js generates a new version of the page in the background and
              updates the static page for future requests
            </strong>
            .
          </li>
          <li>
            When a new request comes in, the updated static page is served.
          </li>
          <li>
            This enables Incremental Static Regeneration on a per page basis
            without rebuilding the full app.{' '}
            <a href='https://github.com/zeit/next.js/discussions/11552'>
              Learn more here
            </a>
            .
          </li>
        </ol>
        <div>
          <strong>Source:</strong>{' '}
          <a href='https://github.com/chibicode/reactions/blob/master/pages/index.js'>
            pages/index.js
          </a>
        </div>
      </main>
    </div>
  )
}

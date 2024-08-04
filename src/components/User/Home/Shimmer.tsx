
import ContentLoader from 'react-content-loader'

const Shimmer = () => {
  return (
    <div>
         <ContentLoader viewBox="0 0 400 460">
    {/* <circle cx="31" cy="31" r="15" /> */}
    {/* <rect x="58" y="18" rx="2" ry="2" width="140" height="10" />
    <rect x="58" y="34" rx="2" ry="2" width="140" height="10" /> */}
    <rect x="0" y="60" rx="2" ry="2" width="400" height="400" />
  </ContentLoader>
    </div>
  )
}

export default Shimmer




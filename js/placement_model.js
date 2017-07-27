{
  name: '123456_Placement_Name',
  dates: options.dates,
  bookedImps: options.bookedImps,
  data: {
    // dates are always the campaign dates
    requestedImps: [],
    reqImpsAgg: [],
    executedImps: [],
    execImpsAgg: [],
    viewableImps: [],
    viewImpsAgg: [],
    viewability: [],
    clicks: [],
    clickRate: [],
    engagements: [],
    clickEng: [],
    engagementRate: [],
    ativ: [],
    videoViewableImps: [],
    video: {
      video0: []
      video25: []
      video50: []
      video75: []
      video100: []
    }
  },
  creative: {
    format: 'super-skin',
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Males Festival'
  }
  audience: {
    gender: 'male',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Tech', 'Lifestyle', 'News' ],
    locations: ['AU Metro', 'AU Regional']
  }
}

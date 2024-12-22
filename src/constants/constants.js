const register_options = [
  {
    id: 0,
    label: "STUDENT"
  },
  {
    id: 1,
    label: "TUTOR"
  }
]

const walkthrough = [
  {
    id: 0,
    title: "Explore Online Courses",
    sub_title: "All types of educational & professional courses available online.",
    image: require("../assets/images/work.png")
  },
  {
    id: 1,
    title: "Explore Online Courses",
    sub_title: "All types of educational & professional courses available online.",
    image: require("../assets/images/work.png")
  },
  {
    id: 2,
    title: "Explore Online Courses",
    sub_title: "All types of educational & professional courses available online.",
    image: require("../assets/images/work.png")
  },
]

const categories = [
  {
    id: 0,
    label: "Mobile Design",
    icon: require("../assets/icons/mobile.png")
  },
  {
    id: 1,
    label: "3D Modeling",
    icon: require("../assets/icons/model_3d.png")
  },
  {
    id: 2,
    label: "Web Designing",
    icon: require("../assets/icons/web_design.png")
  },
  {
    id: 3,
    label: "Illustrations",
    icon: require("../assets/icons/illustration.png")
  },
  {
    id: 4,
    label: "Drawing",
    icon: require("../assets/icons/drawing.png")
  },
  {
    id: 5,
    label: "Animation",
    icon: require("../assets/icons/animation.png")
  },
  {
    id: 6,
    label: "Education",
    icon: require("../assets/icons/education.png")
  },
  {
    id: 7,
    label: "Networking",
    icon: require("../assets/icons/networking.png")
  },
  {
    id: 8,
    label: "Coding",
    icon: require("../assets/icons/coding.png")
  },
]

const screens = {
  home: "Home",
  search: "Search",
  profile: "Profile"
}

const bottom_tabs = [
  {
    id: 0,
    label: screens.home,
    icon: require("../assets/icons/home.png")
  },
  {
    id: 1,
    label: screens.search,
    icon: require("../assets/icons/search.png")
  },
  {
    id: 2,
    label: screens.profile,
    icon: require("../assets/icons/profile.png")
  }
]

const class_types = [
  {
    id: 0,
    label: "All",
    icon: require("../assets/icons/all.png")
  },
  {
    id: 1,
    label: "Academic",
    icon: require("../assets/icons/staff_pick.png")
  },
  {
    id: 2,
    label: "Full-ride",
    icon: require("../assets/icons/original.png")
  },
]

const class_levels = [
  {
    id: 0,
    label: "Beginner"
  },
  {
    id: 1,
    label: "Intermediate"
  },
  {
    id: 2,
    label: "Advanced"
  }
]

const created_within = [
  {
    label: "This Day",
    dateRange: {
      start: new Date(new Date().setHours(0, 0, 0, 0)),
      end: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  },
  {
    label: "This Week",
    dateRange: {
      start: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())),
      end: new Date(),
    },
  },
  {
    label: "This Month",
    dateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date(),
    },
  },
  {
    label: "This Year",
    dateRange: {
      start: new Date(new Date().getFullYear(), 0, 1),
      end: new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999),
    },
  },
  {
    label: "2 Months",
    dateRange: {
      start: new Date(),
      end: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    },
  },
  {
    label: "4 Months",
    dateRange: {
      start: new Date(),
      end: new Date(new Date().setMonth(new Date().getMonth() + 4)),
    },
  },
];


const course_details_tabs = [
  {
    id: 0,
    label: "Description",
  },
  {
    id: 1,
    label: "Feedbacks",
  },
]

export default {
  register_options,
  walkthrough,
  categories,
  screens,
  bottom_tabs,
  class_types,
  class_levels,
  created_within,
  course_details_tabs
}
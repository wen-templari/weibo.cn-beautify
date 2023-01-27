function DOMRegex(regex: RegExp, selectorOption?: string) {
  const output = []
  for (const i of document.querySelectorAll(selectorOption || '*')) {
    if (regex.test(i.id)) { // or whatever attribute you want to search
      output.push(i)
    }
  }
  return output
}

function GM_addStyle(cssStr: string) {
  const D = document
  const newNode = D.createElement('style')
  newNode.textContent = cssStr

  const targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement
  targ.appendChild(newNode)

}



function deleteHeaderAndFooter() {
  const headerTip = document.querySelector("div.tip")
  if (headerTip) {
    headerTip.remove()
  }
  const bottom = document.querySelector("div.b")
  if (bottom) {
    bottom.remove()
  }

}

function getAllBlogs() {
  return DOMRegex(/M_.*/)
}

interface Blog {
  nickname: string
  bloggerLink: string
  content: string
  forward?: Blog
  time: string
  device?: string
  likeLink: string
  likeCount: number
  commentLink: string
  commentCount: number
  forwardLink: string
  forwardCount: number
  addToFavoriteLink: string
}

function praseBlog(node: Element) {
  // nickname
  const nicknameNode = node.querySelector("a.nk") as HTMLAnchorElement | null
  if (!nicknameNode) {
    throw new Error("nickname node not found")
  }
  // time & device 
  const timeDeviceNode = node.querySelector("span.ct") as HTMLSpanElement | null
  const timeDeviceArray = timeDeviceNode?.textContent?.split("来自") || []
  // content 
  const contentNode = node.querySelector("span.ctt") as HTMLDivElement | null

  // action bar
  const bottomContainer = node.lastChild as HTMLDivElement
  const bottomNodes = bottomContainer.querySelectorAll("a") as NodeListOf<HTMLAnchorElement>
  const bottomNodesArray = Array.from(bottomNodes)
  const likeNode = bottomNodesArray.find(node => node.textContent?.includes("赞"))
  const commentNode = bottomNodesArray.find(node => node.textContent?.includes("评论"))
  const forwardNode = bottomNodesArray.find(node => node.textContent?.includes("转发"))
  const addToFavoriteNode = bottomNodesArray.find(node => node.textContent?.includes("收藏"))

  const blog: Blog = {
    nickname: nicknameNode.textContent || "",
    bloggerLink: nicknameNode.href || "",
    content: contentNode?.textContent || "",
    time: "",
    device: "",
    likeLink: likeNode?.href || "",
    likeCount: 0,
    commentLink: commentNode?.href || "",
    commentCount: 0,
    forwardLink: forwardNode?.href || "",
    forwardCount: 0,
    addToFavoriteLink: addToFavoriteNode?.href || "",
  }
  const getFigure = (text: string) => {
    // text[figure]
    const figure = text.match(/\d+/)
    return figure ? parseInt(figure[0]) : 0
  }
  if (likeNode?.textContent) {
    blog.likeCount = getFigure(likeNode.textContent)
  }
  if (commentNode?.textContent) {
    blog.commentCount = getFigure(commentNode.textContent)
  }
  if (forwardNode?.textContent) {
    blog.forwardCount = getFigure(forwardNode.textContent)
  }
  if (forwardNode?.href) {
    blog.forwardLink = forwardNode.href
  }
  if (timeDeviceArray.length > 0) {
    blog.time = timeDeviceArray[0]
    blog.device = timeDeviceArray[1]
  }

  return blog
}


(function () {
  "use strict"

  deleteHeaderAndFooter()
  const blogs = getAllBlogs()
  console.log(blogs.map(praseBlog))

  console.log("hello from script")

})()

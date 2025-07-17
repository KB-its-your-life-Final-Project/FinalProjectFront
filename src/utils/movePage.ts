import router from '@/router'

const movePage = {
  edit() {
    router.push('/mypage/edit')
  },
  home() {
    router.push('/')
  }
}
export default movePage


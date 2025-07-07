import { ElMessageBox } from 'element-plus';

export function useMessageBox() {
  const confirm = (message: string, title: string = '提示', options?: any) => {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
      ...options,
    });
  };

  return {
    confirm,
  };
}

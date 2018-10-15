export class QueryPage {
  page = 1;
  size = 10;

  getTotalPages(total: number) {
    return this.size == 0 ? 1 : Math.ceil(total / this.size);
  }
}

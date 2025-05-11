import { StringSearchField } from '~/shared/ui/string-search-field';

export function SearchTaskCategoriesByName() {
    return <StringSearchField placeholder="Введите название..." property="name" style={{ width: '11rem' }} />;
}

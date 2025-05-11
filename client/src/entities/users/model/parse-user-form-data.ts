export function parseUserFormData(formData: FormData): Record<string, string | undefined> {
    const data = {
        email: formData.get('email'),
        firstName: formData.get('firstName'),
        organizationId: formData.get('organizationId'),
        password: formData.get('password'),
        patronymic: formData.get('patronymic'),
        role: formData.get('role'),
        secondName: formData.get('secondName')
    } as Record<string, string | undefined>;

    if (data.organizationId === '-1') delete data.organizationId;

    return data;
}

export default function IdControlCalidadPage({ params }: { params: { id: string } }) {

    const IdControlCalidad = params.id;

    return <p>{IdControlCalidad}</p>;
}
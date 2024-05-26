from datetime import datetime, timedelta

def generate_fridays(start_date_str, end_date_str):
    # Fecha inicial y final
    start_date = datetime.strptime(start_date_str, '%d-%m-%Y')
    end_date = datetime.strptime(end_date_str, '%d-%m-%Y')

    # Lista de fechas de viernes
    fridays = []

    # Asegurarnos de que la fecha inicial es un viernes
    while start_date.weekday() != 4:  # 4 es el índice de los viernes en Python (lunes=0, martes=1, ..., viernes=4)
        start_date += timedelta(days=1)

    current_date = start_date

    # Generamos la lista de viernes
    while current_date <= end_date:
        fridays.append(current_date.strftime('%d-%m'))
        current_date += timedelta(weeks=1)

    return fridays

if __name__ == "__main__":
    # Ejemplo de uso
    start_date = '01-03-2024'
    end_date = '20-12-2024'
    fridays = generate_fridays(start_date, end_date)
    print(fridays)

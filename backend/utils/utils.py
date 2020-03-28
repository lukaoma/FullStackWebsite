import math

# The following code block was taken from https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates
# Derived from https://www.movable-type.co.uk/scripts/latlong.html

EARTH_RADIUS_KM = 6371

# Converts degrees to radians.
def degrees_to_radians(degrees):
    return degrees * math.pi / 180


# Returns the distance between two coordinate pairs in km.
def coordinate_distance(pos1, pos2):
    lat1, long1 = pos1
    lat2, long2 = pos2

    dLat = degrees_to_radians(lat2 - lat1)
    dLong = degrees_to_radians(long2 - long1)

    lat1 = degrees_to_radians(lat1)
    lat2 = degrees_to_radians(lat2)

    a = (math.sin(dLat / 2) * math.sin(dLat / 2)) + math.sin(dLong / 2) * math.sin(
        dLong / 2
    ) * math.cos(lat1) * math.cos(lat2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return EARTH_RADIUS_KM * c

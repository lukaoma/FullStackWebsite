#!/usr/bin/env python3
import unittest, sys
import json
from simple_rest_client.api import API

# sys.path.append("../..")
# from app import application, db
# from routes.houses import find_nearest_city, get_house_detail, get_city_housing
# from routes.transit import decode_polyline, get_transit_data

from utils import decode_address_string, decode_latlng, decode_polyline
from process import (
    commute_postprocess_many,
    commute_postprocess_single,
    commute_preprocess_many,
)

BACKEND_BASE = "http://localhost:5000/api/"
api = API(api_root_url=BACKEND_BASE, json_encode_body=True)

api.add_resource(resource_name="city")
api.add_resource(resource_name="housing")
api.add_resource(resource_name="commute")


class TestBackend(unittest.TestCase):

    #### COMMUTE TESTS ##### --------------------

    # these two run fine locally but not in CI due to key shenanigans

    # def test_commute_decode_address_1(self):
    #     ret = decode_address_string("3406 Red River Austin TX")
    #     self.assertTrue("lat" in ret and "lng" in ret)

    # def test_commute_decode_address_2(self):
    #     ret = decode_address_string("30.2937784,-97.7274586")
    #     self.assertTrue("lat" in ret and "lng" in ret)

    def test_commute_decode_polyline_1(self):
        poly = """qhzwD|gpsQ}BMgAGD{BLeELqDF_BF}AX??W?Vs@?c@B_@HSJiAz@mAfA]Pk@Rm@L_@]O_@LmDHyBCaBMuEBeAJ_AX_BTs@Zi@x@{@`@a@Za@d@gAfC_HPm@He@QCcAUEAs@Iu@?g@FgB^aDp@gCf@_A?q@G_AUm@Yo@a@i@e@oFmEIGHMILCC{AoA"""
        expected_points = [
            (30.28633, -97.73711),
            (30.28696, -97.73704),
            (30.28732, -97.737),
            (30.28729, -97.73638),
            (30.28722, -97.73539),
            (30.28715, -97.7345),
            (30.28711, -97.73402),
            (30.28707, -97.73355),
            (30.28694, -97.73355),
            (30.28694, -97.73343),
            (30.28694, -97.73355),
            (30.2872, -97.73355),
            (30.28738, -97.73357),
            (30.28754, -97.73362),
            (30.28764, -97.73368),
            (30.28801, -97.73398),
            (30.2884, -97.73434),
            (30.28855, -97.73443),
            (30.28877, -97.73453),
            (30.289, -97.7346),
            (30.28916, -97.73445),
            (30.28924, -97.73429),
            (30.28917, -97.73342),
            (30.28912, -97.73281),
            (30.28914, -97.73232),
            (30.28921, -97.73125),
            (30.28919, -97.7309),
            (30.28913, -97.73058),
            (30.289, -97.7301),
            (30.28889, -97.72984),
            (30.28875, -97.72963),
            (30.28846, -97.72933),
            (30.28829, -97.72916),
            (30.28815, -97.72899),
            (30.28796, -97.72863),
            (30.28728, -97.72719),
            (30.28719, -97.72696),
            (30.28714, -97.72677),
            (30.28723, -97.72675),
            (30.28757, -97.72664),
            (30.2876, -97.72663),
            (30.28786, -97.72658),
            (30.28813, -97.72658),
            (30.28833, -97.72662),
            (30.28885, -97.72678),
            (30.28966, -97.72703),
            (30.29034, -97.72723),
            (30.29066, -97.72723),
            (30.29091, -97.72719),
            (30.29123, -97.72708),
            (30.29146, -97.72695),
            (30.2917, -97.72678),
            (30.29191, -97.72659),
            (30.29311, -97.72556),
            (30.29316, -97.72552),
            (30.29311, -97.72545),
            (30.29316, -97.72552),
            (30.29318, -97.7255),
            (30.29364, -97.7251),
        ]

        self.assertEqual(decode_polyline(poly), expected_points)

    def test_commute_decode_polyline_2(self):
        poly = "cugyDxjisQCo@]e@IQ\\_@t@u@pCgDrCoDh@}@V}A[mKa@kI?}NUoBq@{C|@WzFgBfF{ArBUbA?jBKrDa@`AOtCMb@AOXUn@g@~Ei@rHM~JAzBTn@R\\XHr@@|Ek@nGu@pBU@PAQ`CY|De@b@Ej@@v@^r@L`BIZJn@jAxBqAlA_AZm@VyAWuFWkE@}BPoClAaJh@qB|@aBhAgA`GeDvCaB_IwIuRkScDqDg@_@y@Ss@D_EhAgA`@iA^h@lCX`BLl@dCq@BJd@{@Ou@y@wEbEaAbAVN@dBjB|DnEzKdLLLr@p@\\Sh@YjEeCjBy@pHaC`B{@`Aq@hCyBdDkBzAs@fHeCdKoCxAM|A@`FP|AGvBc@hBa@lDeAbBo@fHgCrE_BzDeAlFwAfCi@`IcBrIuB~KsCzDs@|J{AfAQZZJJbAn@~ChBxCdBx@r@JJs@pBGLW\\sAdAiCxB_BpEgA|C[d@g@ZsAN{@SoC}AkAq@y@g@Sh@mA|Cc@fAc@r@}HjGy@^k@DkCHGcEM{HEsIOiHE_Al@QrA]vA]~F}A|JiB|Ew@nBc@dH}C|F_BhBs@hE_AjQwDfFkAdRaE|]qHlG{@rBQ~HUtDBlFVfv@hItN`BtJbA`AXfBRhBXrFlApIdAr[lDr^fEZHLy@XyA~AeFbFqMrAkDt@mBb@kAlBn@tBr@zA^f@Hn@EfCq@n@EfD^TBCXIbAMl@{@~@SvAf@FMCGp@L@Ic@Ps@Bc@Nm@Zu@NaBBYWCsBYaB?gCp@o@Dg@IyAm@aGwB}DfKyF`OmAjGMd@ELZHRFd@V|B`AhC`Apd@~ShItDvC`AhBb@dEj@~GRfGLrG^vJ|@zNtAhNbAnM`@pHf@tEt@|A`@|C~@dF~AbXjIvZlJbJbDrV`LpR`Jdr@z[~YdN~L~FfUnKzGbD`Av@bBdBrMxRxRbZDl@nA|BfBzC|@pB`AdBxAdBnAnA~BzBv@h@nAr@fJzDnExBlCjAf@ZTEdGdDbGfDxK~FxAt@hAp@r@d@xAz@lDjBnAh@b[pPvS`LxVdNxGjD~SjLxEhClEfCnBxAbAd@|AVlBHbAEvQp@zCNtBd@rIpEtCbBz^fSzHhEn[zPtHbExAz@h@ELCvKwErBaAf@W~@IdDNr@DhJd@~DNfB?f@?jGXAZ@[b@B@k@@WLK?SMGGMDiAH@HkCf@@JsCF_Bg@CBw@J}CFiBH@BkAFaB@QPqCTgAKg@Ac@JCHKJWGa@IKIEJuBz@J"
        expected_points = [
            (30.51874, -97.70173),
            (30.51876, -97.70149),
            (30.51891, -97.7013),
            (30.51896, -97.70121),
            (30.51881, -97.70105),
            (30.51854, -97.70078),
            (30.51781, -97.69994),
            (30.51707, -97.69906),
            (30.51686, -97.69875),
            (30.51674, -97.69828),
            (30.51688, -97.69629),
            (30.51705, -97.69463),
            (30.51705, -97.69208),
            (30.51716, -97.69152),
            (30.51741, -97.69074),
            (30.5171, -97.69062),
            (30.51584, -97.6901),
            (30.51468, -97.68964),
            (30.5141, -97.68953),
            (30.51376, -97.68953),
            (30.51322, -97.68947),
            (30.51232, -97.6893),
            (30.51199, -97.68922),
            (30.51124, -97.68915),
            (30.51106, -97.68914),
            (30.51114, -97.68927),
            (30.51125, -97.68951),
            (30.51145, -97.69063),
            (30.51166, -97.69217),
            (30.51173, -97.69409),
            (30.51174, -97.69471),
            (30.51163, -97.69495),
            (30.51153, -97.6951),
            (30.5114, -97.69515),
            (30.51114, -97.69516),
            (30.51003, -97.69494),
            (30.50867, -97.69467),
            (30.5081, -97.69456),
            (30.50809, -97.69465),
            (30.5081, -97.69456),
            (30.50745, -97.69443),
            (30.5065, -97.69424),
            (30.50632, -97.69421),
            (30.5061, -97.69422),
            (30.50582, -97.69438),
            (30.50556, -97.69445),
            (30.50507, -97.6944),
            (30.50493, -97.69446),
            (30.50469, -97.69484),
            (30.50408, -97.69443),
            (30.50369, -97.69411),
            (30.50355, -97.69388),
            (30.50343, -97.69343),
            (30.50355, -97.6922),
            (30.50367, -97.69118),
            (30.50366, -97.69055),
            (30.50357, -97.68983),
            (30.50318, -97.68806),
            (30.50297, -97.68749),
            (30.50266, -97.687),
            (30.50229, -97.68664),
            (30.501, -97.68581),
            (30.50024, -97.68532),
            (30.50184, -97.6836),
            (30.50499, -97.68034),
            (30.50581, -97.67945),
            (30.50601, -97.67929),
            (30.5063, -97.67919),
            (30.50656, -97.67922),
            (30.50752, -97.67959),
            (30.50788, -97.67976),
            (30.50825, -97.67992),
            (30.50804, -97.68063),
            (30.50791, -97.68112),
            (30.50784, -97.68135),
            (30.50717, -97.6811),
            (30.50715, -97.68116),
            (30.50696, -97.68086),
            (30.50704, -97.68059),
            (30.50733, -97.67951),
            (30.50635, -97.67918),
            (30.50601, -97.6793),
            (30.50593, -97.67931),
            (30.50542, -97.67985),
            (30.50447, -97.68089),
            (30.50241, -97.683),
            (30.50234, -97.68307),
            (30.50208, -97.68332),
            (30.50193, -97.68322),
            (30.50172, -97.68309),
            (30.5007, -97.68242),
            (30.50016, -97.68213),
            (30.49863, -97.68148),
            (30.49814, -97.68118),
            (30.49781, -97.68093),
            (30.49712, -97.68032),
            (30.49629, -97.67978),
            (30.49583, -97.67952),
            (30.49435, -97.67885),
            (30.4924, -97.67813),
            (30.49195, -97.67806),
            (30.49148, -97.67807),
            (30.49035, -97.67816),
            (30.48988, -97.67812),
            (30.48928, -97.67794),
            (30.48875, -97.67777),
            (30.48788, -97.67742),
            (30.48738, -97.67718),
            (30.4859, -97.6765),
            (30.48484, -97.67602),
            (30.4839, -97.67567),
            (30.48271, -97.67523),
            (30.48203, -97.67502),
            (30.48042, -97.67452),
            (30.47872, -97.67393),
            (30.47664, -97.67319),
            (30.4757, -97.67293),
            (30.47379, -97.67247),
            (30.47343, -97.67238),
            (30.47329, -97.67252),
            (30.47323, -97.67258),
            (30.47289, -97.67282),
            (30.47209, -97.67335),
            (30.47132, -97.67386),
            (30.47103, -97.67412),
            (30.47097, -97.67418),
            (30.47123, -97.67475),
            (30.47127, -97.67482),
            (30.47139, -97.67497),
            (30.47181, -97.67532),
            (30.4725, -97.67593),
            (30.47298, -97.67698),
            (30.47334, -97.67777),
            (30.47348, -97.67796),
            (30.47368, -97.6781),
            (30.4741, -97.67818),
            (30.4744, -97.67808),
            (30.47512, -97.67761),
            (30.4755, -97.67736),
            (30.47579, -97.67716),
            (30.47589, -97.67737),
            (30.47628, -97.67816),
            (30.47646, -97.67852),
            (30.47664, -97.67878),
            (30.47823, -97.68012),
            (30.47852, -97.68028),
            (30.47874, -97.68031),
            (30.47944, -97.68036),
            (30.47948, -97.67938),
            (30.47955, -97.6778),
            (30.47958, -97.6761),
            (30.47966, -97.67461),
            (30.47969, -97.67429),
            (30.47946, -97.6742),
            (30.47904, -97.67405),
            (30.4786, -97.6739),
            (30.47732, -97.67343),
            (30.47541, -97.6729),
            (30.4743, -97.67262),
            (30.47374, -97.67244),
            (30.47227, -97.67165),
            (30.471, -97.67117),
            (30.47047, -97.67091),
            (30.46946, -97.67059),
            (30.46652, -97.66967),
            (30.46536, -97.66929),
            (30.46229, -97.66832),
            (30.45734, -97.66679),
            (30.45599, -97.66649),
            (30.45541, -97.6664),
            (30.45381, -97.66629),
            (30.4529, -97.66631),
            (30.45171, -97.66643),
            (30.44287, -97.66808),
            (30.44036, -97.66857),
            (30.43849, -97.66891),
            (30.43816, -97.66904),
            (30.43764, -97.66914),
            (30.43711, -97.66927),
            (30.43589, -97.66966),
            (30.4342, -97.67001),
            (30.42962, -97.67088),
            (30.42456, -97.67188),
            (30.42442, -97.67193),
            (30.42435, -97.67164),
            (30.42422, -97.67119),
            (30.42374, -97.67004),
            (30.4226, -97.66771),
            (30.42218, -97.66685),
            (30.42191, -97.6663),
            (30.42173, -97.66592),
            (30.42118, -97.66616),
            (30.42059, -97.66642),
            (30.42013, -97.66658),
            (30.41993, -97.66663),
            (30.41969, -97.6666),
            (30.41901, -97.66635),
            (30.41877, -97.66632),
            (30.41793, -97.66648),
            (30.41782, -97.6665),
            (30.41784, -97.66663),
            (30.41789, -97.66697),
            (30.41796, -97.6672),
            (30.41826, -97.66752),
            (30.41836, -97.66796),
            (30.41816, -97.668),
            (30.41823, -97.66798),
            (30.41827, -97.66823),
            (30.4182, -97.66824),
            (30.41825, -97.66806),
            (30.41816, -97.6678),
            (30.41814, -97.66762),
            (30.41806, -97.66739),
            (30.41792, -97.66712),
            (30.41784, -97.66663),
            (30.41782, -97.6665),
            (30.41794, -97.66648),
            (30.41852, -97.66635),
            (30.41901, -97.66635),
            (30.41969, -97.6666),
            (30.41993, -97.66663),
            (30.42013, -97.66658),
            (30.42058, -97.66635),
            (30.42187, -97.66575),
            (30.42282, -97.66771),
            (30.42407, -97.67028),
            (30.42446, -97.67162),
            (30.42453, -97.67181),
            (30.42456, -97.67188),
            (30.42442, -97.67193),
            (30.42432, -97.67197),
            (30.42413, -97.67209),
            (30.4235, -97.67242),
            (30.42281, -97.67275),
            (30.4168, -97.67611),
            (30.41515, -97.67702),
            (30.41439, -97.67735),
            (30.41386, -97.67753),
            (30.41287, -97.67775),
            (30.41143, -97.67785),
            (30.41011, -97.67792),
            (30.40873, -97.67808),
            (30.40685, -97.67839),
            (30.40431, -97.67882),
            (30.40186, -97.67916),
            (30.39954, -97.67933),
            (30.39801, -97.67953),
            (30.39694, -97.6798),
            (30.39647, -97.67997),
            (30.39568, -97.68029),
            (30.39453, -97.68077),
            (30.39051, -97.68243),
            (30.38607, -97.68426),
            (30.38429, -97.68508),
            (30.38051, -97.68717),
            (30.37738, -97.68894),
            (30.36919, -97.69356),
            (30.36487, -97.69599),
            (30.36263, -97.69727),
            (30.35907, -97.69927),
            (30.35765, -97.70009),
            (30.35732, -97.70037),
            (30.35682, -97.70088),
            (30.35448, -97.70405),
            (30.35131, -97.70839),
            (30.35128, -97.70862),
            (30.35088, -97.70925),
            (30.35036, -97.71003),
            (30.35005, -97.7106),
            (30.34972, -97.71111),
            (30.34927, -97.71162),
            (30.34887, -97.71202),
            (30.34823, -97.71264),
            (30.34795, -97.71285),
            (30.34755, -97.71311),
            (30.34575, -97.71405),
            (30.34471, -97.71466),
            (30.344, -97.71504),
            (30.3438, -97.71518),
            (30.34369, -97.71515),
            (30.34238, -97.71598),
            (30.34108, -97.71682),
            (30.33903, -97.7181),
            (30.33858, -97.71837),
            (30.33821, -97.71862),
            (30.33795, -97.71881),
            (30.3375, -97.71911),
            (30.33663, -97.71965),
            (30.33623, -97.71986),
            (30.33173, -97.72267),
            (30.32841, -97.72476),
            (30.3246, -97.72719),
            (30.32319, -97.72805),
            (30.31983, -97.73019),
            (30.31874, -97.73088),
            (30.31771, -97.73156),
            (30.31715, -97.73201),
            (30.31681, -97.7322),
            (30.31634, -97.73232),
            (30.31579, -97.73237),
            (30.31545, -97.73234),
            (30.31245, -97.73259),
            (30.31167, -97.73267),
            (30.31108, -97.73286),
            (30.30938, -97.73391),
            (30.30863, -97.73441),
            (30.30353, -97.73765),
            (30.30195, -97.73866),
            (30.29739, -97.74152),
            (30.29584, -97.7425),
            (30.29539, -97.7428),
            (30.29518, -97.74277),
            (30.29511, -97.74275),
            (30.29307, -97.74167),
            (30.29249, -97.74134),
            (30.29229, -97.74122),
            (30.29197, -97.74117),
            (30.29114, -97.74125),
            (30.29088, -97.74128),
            (30.28907, -97.74147),
            (30.28811, -97.74155),
            (30.28759, -97.74155),
            (30.28739, -97.74155),
            (30.28605, -97.74168),
            (30.28606, -97.74182),
            (30.28605, -97.74168),
            (30.28587, -97.7417),
            (30.28586, -97.74148),
            (30.28585, -97.74136),
            (30.28578, -97.7413),
            (30.28578, -97.7412),
            (30.28585, -97.74116),
            (30.28589, -97.74109),
            (30.28586, -97.74072),
            (30.28581, -97.74073),
            (30.28576, -97.74003),
            (30.28556, -97.74004),
            (30.2855, -97.7393),
            (30.28546, -97.73882),
            (30.28566, -97.7388),
            (30.28564, -97.73852),
            (30.28558, -97.73773),
            (30.28554, -97.7372),
            (30.28549, -97.73721),
            (30.28547, -97.73683),
            (30.28543, -97.73634),
            (30.28542, -97.73625),
            (30.28533, -97.73552),
            (30.28522, -97.73516),
            (30.28528, -97.73496),
            (30.28529, -97.73478),
            (30.28523, -97.73476),
            (30.28518, -97.7347),
            (30.28512, -97.73458),
            (30.28516, -97.73441),
            (30.28521, -97.73435),
            (30.28526, -97.73432),
            (30.2852, -97.73373),
            (30.2849, -97.73379),
        ]

        self.assertEqual(decode_polyline(poly), expected_points)

    # this one actually runs fine, just not in CI due to key shenanigans

    # def test_commute_preprocess_many_1(self):
    #     args = {
    #         "search_params": {
    #             "filters": [
    #                 {
    #                     "name": "home",
    #                     "op": "eq",
    #                     "val": "3406 Red River St Austin Texas",
    #                 },
    #                 {
    #                     "name": "work",
    #                     "op": "eq",
    #                     "val": "Gates Dell Center Austin Texas",
    #                 },
    #             ]
    #         }
    #     }
    #     commute_preprocess_many(**args)
    #     filters = args["search_params"]["filters"]
    #     try:
    #         lat1, lng1 = (float(x) for x in filters[0]["val"].split(","))
    #         lat2, lng2 = (float(x) for x in filters[1]["val"].split(","))
    #         self.assertTrue(True)
    #     except ValueError:
    #         self.assertFalse(True)

    #### HOUSING TESTS ##### --------------------

    def test_get_housing_list(self):
        response = api.housing.list().body
        house = response["objects"][0]

        self.assertTrue("id" in house)
        self.assertTrue("address" in house)
        self.assertTrue("zipCode" in house)
        self.assertTrue("latitude" in house)
        self.assertTrue("longitude" in house)
        self.assertTrue("rent" in house)
        self.assertTrue("area" in house)
        self.assertTrue("beds" in house)
        self.assertTrue("baths" in house)
        self.assertTrue("desc" in house)
        self.assertTrue("img" in house)
        self.assertTrue("city" in house)
        self.assertTrue("routes" in house)

    def test_get_housing_filter_1(self):
        filters = [{"name": "address", "op": "eq", "val": "8615 W Weldon Ave"}]
        response = api.housing.list(params={"q": json.dumps({"filters": filters})}).body
        for house in response["objects"]:
            self.assertEqual(house["address"], "8615 W Weldon Ave")

    def test_get_housing_filter_2(self):
        filters = [{"name": "zipCode", "op": "eq", "val": 95822}]
        response = api.housing.list(params={"q": json.dumps({"filters": filters})}).body
        for house in response["objects"]:
            self.assertEqual(house["zipCode"], 95822)

    def test_get_housing_filter_3(self):
        filters = [{"name": "rent", "op": "le", "val": 700}]
        response = api.housing.list(params={"q": json.dumps({"filters": filters})}).body
        for house in response["objects"]:
            self.assertLessEqual(house["rent"], 700)

    #### CITIES TESTS #### --------------------

    def test_get_cities_list(self):
        response = api.city.list().body
        self.assertTrue(len(response["objects"]) > 0)
        city = response["objects"][0]

        self.assertTrue("id" in city)
        self.assertTrue("name" in city)
        self.assertTrue("state" in city)
        self.assertTrue("population" in city)
        self.assertTrue("latitude" in city)
        self.assertTrue("longitude" in city)
        self.assertTrue("median_age" in city)
        self.assertTrue("median_wage" in city)
        self.assertTrue("median_property_value" in city)
        self.assertTrue("num_employees" in city)
        self.assertTrue("poverty_rate" in city)
        self.assertTrue("desc" in city)

    def test_get_city_filter_1(self):
        filters = [{"name": "name", "op": "eq", "val": "Austin"}]
        response = api.city.list(params={"q": json.dumps({"filters": filters})}).body
        for city in response["objects"]:
            self.assertEqual(city["name"], "Austin")

    def test_get_city_filter_2(self):
        filters = [{"name": "state", "op": "eq", "val": "California"}]
        response = api.city.list(params={"q": json.dumps({"filters": filters})}).body
        for city in response["objects"]:
            self.assertEqual(city["state"], "California")

    def test_get_city_filter_3(self):
        filters = [{"name": "poverty_rate", "op": "gt", "val": 0.2}]
        response = api.city.list(params={"q": json.dumps({"filters": filters})}).body
        for city in response["objects"]:
            self.assertGreater(city["poverty_rate"], 0.2)


if __name__ == "__main__":
    unittest.main()

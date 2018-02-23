using System.IO;
using System.Windows.Forms;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Framework;
using ESRI.ArcGIS.Editor;
using ESRI.ArcGIS.EditorExt;
using System.Collections.Generic;
using ESRI.ArcGIS.ArcMapUI;

namespace CreateData
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void btnCreateData_Click(object sender, System.EventArgs e)
        {

            var x = ArcMap.Document.FocusMap;
            IFeatureLayer fl = x.Layer[0] as IFeatureLayer;
            IFeatureLayer fl1 = x.Layer[1] as IFeatureLayer;
            IFeatureLayer fl2 = x.Layer[2] as IFeatureLayer;
            IFeatureLayer fl3 = x.Layer[3] as IFeatureLayer;
            IFeatureLayer fl4 = x.Layer[4] as IFeatureLayer;
            //return;
            IEditor ed = (IEditor)ArcMap.Application.FindExtensionByName("ESRI Object Editor");
            ed.StartOperation();
            IPoint pnt = new PointClass();
            pnt.PutCoords(-12970000, 4005000);
            IFeatureClass sourceFC = fl.FeatureClass;
            IFeatureClass juncFC = fl1.FeatureClass;
            IFeatureClass fuseFC = fl2.FeatureClass;
            IFeatureClass serveFC = fl3.FeatureClass;
            IFeatureClass lineFC = fl4.FeatureClass;
            //IFeatureClass 
            IFeature sourceFeature = sourceFC.CreateFeature();
            sourceFeature.Shape = pnt;
            Queue<IPoint> pntq = new  Queue<IPoint>();
            pntq.Enqueue(pnt);
            sourceFeature.Store();
            int spCounter = 0;
            int lineCounter = 0;
            int juncCounter = 0;
            var numberOfLinesArray= new int[] { 7,5,3,3   };
            var lineLengthArray = new double[] { 5000, 2000,500,10 };
            for(int i = 0; i < numberOfLinesArray.Length; i++)
            {
                var lineLength = lineLengthArray[i];
                var numberOfLines = numberOfLinesArray[i];
                double angleRadian = (2.0 * System.Math.PI) / numberOfLines;
                List<IPoint> allPointsAtLevel = new List<IPoint>();
                while(pntq.Count > 0)
                {
                    IPoint startPoint = pntq.Dequeue();
                    List<IPoint> pointsToEnque = CreateLinesAtStartPoint(numberOfLines, ref lineCounter, ref juncCounter, ref spCounter, startPoint, lineLength, angleRadian, lineFC,
                        fuseFC,serveFC, juncFC);
                    allPointsAtLevel.AddRange(pointsToEnque);
                }
                foreach(IPoint pnt2NQ in allPointsAtLevel)
                {
                    pntq.Enqueue(pnt2NQ);
                }

            }
 
            ed.StopOperation("Make Data");


        }

        
        private List<IPoint> CreateLinesAtStartPoint(int numberOfLines, ref int lineCounter,ref int juncCounter, ref int spCounter, IPoint startPoint, 
            double lineLength, double angleInRadians, IFeatureClass lineFC, IFeatureClass fuseFC, IFeatureClass serveFC, IFeatureClass juncFC)
        {
            List<IPoint> retList = new List<IPoint>();
            System.Random rnd = new System.Random();
            double starter = 1.0 /  rnd.Next(1, 9) ;
            //starter = .5;
            for (double index = starter; index < numberOfLines; index++)
            {
                IConstructPoint outPoint = new PointClass();
                outPoint.ConstructAngleDistance(startPoint, angleInRadians * index, lineLength);
                IPoint outPointpnt = outPoint as IPoint;
                IPointCollection pc = new PolylineClass();
                pc.AddPoint(startPoint); pc.AddPoint(outPointpnt);
                IFeature lineFe = lineFC.CreateFeature();
                lineFe.Shape = pc as IGeometry;
                lineFe.Store();
                lineCounter++;
                ICurve curve = (ICurve)lineFe.ShapeCopy;
                bool brs = false; double dfc = 0; double dac = 0;
                IPoint pntToNQ = new PointClass();
                if (lineLength > 200)
                {
                    for (int j = 0; j <= numberOfLines; j++)
                    {
                        dac = j * (1.0 / numberOfLines);
                        if(dac ==0 )
                        {
                            IConstructPoint pntCP2 = new PointClass();
                            pntCP2.ConstructAlong(curve, esriSegmentExtension.esriNoExtension, 1, false);
                            IPoint pntcp2pnt = (IPoint)pntCP2;
                            IFeature fuseFe = fuseFC.CreateFeature();
                            fuseFe.Shape = pntcp2pnt as IGeometry;
                            fuseFe.Store();
                        }
                        else
                        {
                            IConstructPoint pntCP2 = new PointClass();
                            pntCP2.ConstructAlong(curve, esriSegmentExtension.esriNoExtension, dac, true);
                            IPoint pntcp2pnt = (IPoint)pntCP2;
                            IFeature juncfe = juncFC.CreateFeature();
                            juncfe.Shape = pntcp2pnt as IGeometry;
                            juncfe.Store();
                            retList.Add(pntcp2pnt as IPoint);
                            juncCounter++;
                        }

                    }
                }
                else
                {
                    IFeature servFe = serveFC.CreateFeature();
                    servFe.Shape = outPointpnt as IGeometry;
                    servFe.Store();
                    spCounter++;
                }
            }
            return retList;
        }
        private object DoSomething(string what, object parameters)
        {
            switch (what)
            {
                case "":
                    break;
            }
            return null;
        }
    }
}

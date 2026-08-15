# -*- coding: utf-8 -*-
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import os

# 注册中文字体
font_path = "C:/Windows/Fonts/simsun.ttc"
if os.path.exists(font_path):
    pdfmetrics.registerFont(TTFont('SimSun', font_path, subfontIndex=0))
    chinese_font = 'SimSun'
else:
    chinese_font = 'Helvetica'

# 创建PDF
output_path = r"C:\Users\沈培桐\Desktop\广东税务完税证明\完税证明.pdf"
doc = SimpleDocTemplate(output_path, pagesize=A4,
                       leftMargin=25*mm, rightMargin=25*mm,
                       topMargin=20*mm, bottomMargin=20*mm)

# 样式
styles = getSampleStyleSheet()
title_style = ParagraphStyle('Title', parent=styles['Title'],
                             fontName=chinese_font, fontSize=18, alignment=TA_CENTER,
                             spaceAfter=6*mm)
normal_style = ParagraphStyle('Normal', parent=styles['Normal'],
                              fontName=chinese_font, fontSize=10.5, leading=14)
small_style = ParagraphStyle('Small', parent=styles['Normal'],
                            fontName=chinese_font, fontSize=9, leading=12)
center_style = ParagraphStyle('Center', parent=styles['Normal'],
                              fontName=chinese_font, fontSize=10.5, alignment=TA_CENTER)
right_style = ParagraphStyle('Right', parent=styles['Normal'],
                             fontName=chinese_font, fontSize=10.5, alignment=TA_RIGHT)

elements = []

# 右上角证明号
elements.append(Paragraph("26（0818）44证明60015469", right_style))
elements.append(Spacer(1, 3*mm))

# 主标题
elements.append(Paragraph("<b>中华人民共和国</b>", title_style))
elements.append(Paragraph("<b>税收完税证明</b>", title_style))
elements.append(Spacer(1, 2*mm))

# 基本信息表格1
data1 = [
    ['税 务 机 关', '国家税务总局广东省税务局', '填 发 日 期', '2026-08-18'],
    ['纳税人名称', '沈照', '纳税人识别号', '445122199901023746'],
]

table1 = Table(data1, colWidths=[30*mm, 60*mm, 30*mm, 40*mm])
table1.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), chinese_font),
    ('FONTSIZE', (0, 0), (-1, -1), 10.5),
    ('ALIGN', (0, 0), (0, -1), 'LEFT'),
    ('ALIGN', (1, 0), (1, -1), 'LEFT'),
    ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
    ('ALIGN', (3, 0), (3, -1), 'LEFT'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
elements.append(table1)
elements.append(Spacer(1, 5*mm))

# 社保缴费表格
data2 = [
    ['', '', '养老保险', '', '医疗保险', '', '失业保险', '', '工伤保险', '', '生育保险'],
    ['', '用人单位', '单位', '个人', '单位', '个人', '单位', '个人', '单位', '个人', '单位', '个人'],
    ['202608', '01', '573.00', '382.00', '-', '-', '-', '-', '-', '-', '-', '-'],
]

table2 = Table(data2, colWidths=[15*mm, 15*mm, 12*mm, 12*mm, 12*mm, 12*mm, 12*mm, 12*mm, 12*mm, 12*mm, 12*mm, 12*mm])
table2.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), chinese_font),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
    ('BACKGROUND', (0, 0), (-1, 1), colors.Color(0.95, 0.95, 0.95)),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
]))
elements.append(table2)
elements.append(Spacer(1, 8*mm))

# 金额合计表格
data3 = [
    ['金额合计（大写）', '玖佰伍拾伍元整', '￥955.00'],
]

table3 = Table(data3, colWidths=[40*mm, 50*mm, 30*mm])
table3.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), chinese_font),
    ('FONTSIZE', (0, 0), (-1, -1), 10.5),
    ('ALIGN', (0, 0), (0, 0), 'LEFT'),
    ('ALIGN', (1, 0), (1, 0), 'CENTER'),
    ('ALIGN', (2, 0), (2, 0), 'RIGHT'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('BOX', (0, 0), (-1, -1), 1, colors.black),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
]))
elements.append(table3)
elements.append(Spacer(1, 3*mm))

# 备注
elements.append(Paragraph("<b>备 注</b>", normal_style))
elements.append(Spacer(1, 2*mm))

# 备注内容
note_text = """备注：不同打印设备造成的色差不影响使用效力<br/>
"用人单位"对应信息：01 单位社保号1119000001419855沈照，税务机关：<br/>
国家税务总局饶平县税务局；社保机构：饶平县社会保险基金管理局。<br/>
（本凭证不含在东莞的缴费信息，退费信息仅包含在广州、佛山的信息）"""
elements.append(Paragraph(note_text, small_style))
elements.append(Spacer(1, 5*mm))

# 签章区域
sign_data = [
    ['税务机关', '填票人'],
    ['（盖章）', '电子税务局'],
]
sign_table = Table(sign_data, colWidths=[70*mm, 70*mm])
sign_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), chinese_font),
    ('FONTSIZE', (0, 0), (-1, -1), 10.5),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
]))
elements.append(sign_table)
elements.append(Spacer(1, 3*mm))

# 页码
elements.append(Paragraph("当前第 1 页/共 1 页", small_style))
elements.append(Spacer(1, 3*mm))

# 底部声明
elements.append(Paragraph("本 凭 证 不 作 纳 税 人 记 账 、抵 扣 凭 证", center_style))
elements.append(Spacer(1, 2*mm))

# 查验网址
verify_url = "查验网址：https://etax.guangdong.chinatax.gov.cn/web-ssws/dzspController/dzsp/dzspCyInit.do"
elements.append(Paragraph(verify_url, small_style))

# 生成PDF
doc.build(elements)

print(f"PDF已生成: {output_path}")
